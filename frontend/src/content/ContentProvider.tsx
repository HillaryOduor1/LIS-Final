import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

// Simple logger that only shows in development
const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, but format them nicely
    if (import.meta.env.PROD) {
      // In production, send to error reporting service
      console.error('[LIS Error]', ...args);
    } else {
      console.error(...args);
    }
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  }
};

const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";

const getApiUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/content?tenant=${TENANT}`;
  }
  return `/api/content?tenant=${TENANT}`;
};

const API_URL = getApiUrl();
const VERSION_URL = API_URL.replace('/content', '/content/version');

const CACHE_TTL = import.meta.env.PROD ? 60 * 1000 : 5 * 60 * 1000;
const CACHE_KEY = `site_content_cache_${TENANT}`;
const CONTENT_VERSION_KEY = `site_content_version_${TENANT}`;

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
  version: number;
}

const extractContentFromResponse = (responseData: any): { content: SiteContent | null; version: number } => {
  let extractedContent: SiteContent | null = null;
  let version = Date.now();
  
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        logger.warn('Empty data array received');
        return { content: null, version };
      }
      const homeContent = dataContent.find((item: any) => item.page === 'home') || dataContent[0];
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        extractedContent = homeContent.data as SiteContent;
        version = homeContent.updatedAt || homeContent.version || version;
      } else {
        extractedContent = homeContent as SiteContent;
        version = homeContent.updatedAt || homeContent.version || version;
      }
    }
    
    if (typeof dataContent === 'object' && !Array.isArray(dataContent)) {
      if (dataContent.data && typeof dataContent.data === 'object') {
        extractedContent = dataContent.data as SiteContent;
        version = dataContent.updatedAt || dataContent.version || version;
      } else {
        extractedContent = dataContent as SiteContent;
        version = dataContent.updatedAt || dataContent.version || version;
      }
    }
  }
  
  if (!extractedContent && responseData && responseData.page === 'home') {
    extractedContent = responseData as SiteContent;
    version = responseData.updatedAt || responseData.version || version;
  }
  
  if (!extractedContent && Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find((item: any) => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      extractedContent = homeContent.data as SiteContent;
      version = homeContent.updatedAt || homeContent.version || version;
    } else if (homeContent) {
      extractedContent = homeContent as SiteContent;
      version = homeContent.updatedAt || homeContent.version || version;
    }
  }
  
  return { content: extractedContent, version };
};

const checkContentVersion = async (): Promise<number | null> => {
  try {
    const response = await fetch(VERSION_URL, {
      credentials: "include",
      headers: { 
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    let version = null;
    if (data.data && data.data.version) {
      version = data.data.version;
    } else if (data.version) {
      version = data.version;
    } else if (data.updatedAt) {
      version = new Date(data.updatedAt).getTime();
    }
    
    return version;
  } catch (error) {
    return null;
  }
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentVersion, setCurrentVersion] = React.useState<number>(() => {
    const savedVersion = localStorage.getItem(CONTENT_VERSION_KEY);
    return savedVersion ? parseInt(savedVersion, 10) : 0;
  });

  const loadContent = React.useCallback(async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp, version }: CacheEntry = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setContent(data);
            setCurrentVersion(version);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          logger.warn('Failed to parse cache:', e);
        }
      }
    }

    setIsLoading(true);
    let response: Response | undefined;
    
    try {
      const cacheBuster = import.meta.env.PROD ? `&_=${Date.now()}` : '';
      const url = `${API_URL}${cacheBuster}`;
      
      response = await fetch(url, { 
        credentials: "include",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error("Backend did not return JSON");
      }

      const responseData = await response.json();
      const { content: loadedContent, version: newVersion } = extractContentFromResponse(responseData);
      
      if (loadedContent && Object.keys(loadedContent).length > 0) {
        if (newVersion > currentVersion || force) {
          const mergedContent = { ...staticDefault, ...loadedContent };
          setContent(mergedContent);
          setCurrentVersion(newVersion);
          
          const cacheEntry: CacheEntry = { 
            data: mergedContent, 
            timestamp: Date.now(),
            version: newVersion
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
          localStorage.setItem(CONTENT_VERSION_KEY, newVersion.toString());
        }
      } else {
        logger.warn('No valid content received, using fallback');
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      logger.error("Failed to load content:", error);
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, [currentVersion]);

  const checkVersionAndReload = React.useCallback(async () => {
    const serverVersion = await checkContentVersion();
    if (serverVersion && serverVersion > currentVersion) {
      await loadContent(true);
    }
  }, [currentVersion, loadContent]);

  const refresh = React.useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    return loadContent(true);
  }, [loadContent]);

  React.useEffect(() => {
    if (!import.meta.env.PROD) return;
    
    const interval = setInterval(() => {
      checkVersionAndReload();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [checkVersionAndReload]);

  React.useEffect(() => {
    const handleContentUpdated = () => {
      localStorage.removeItem(CACHE_KEY);
      loadContent(true);
    };
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [loadContent]);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONTENT_VERSION_KEY && e.newValue) {
        const newVersion = parseInt(e.newValue, 10);
        if (newVersion > currentVersion) {
          loadContent(true);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentVersion, loadContent]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          page: "home",
          ...newContent,
          tenantId: TENANT,
          updatedAt: new Date().toISOString()
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      const newVersion = Date.now();
      
      setContent(newContent);
      setCurrentVersion(newVersion);
      
      const cacheEntry: CacheEntry = { 
        data: newContent, 
        timestamp: Date.now(),
        version: newVersion
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      localStorage.setItem(CONTENT_VERSION_KEY, newVersion.toString());
      
      window.dispatchEvent(new Event("content-updated"));
      return true;
    } catch (error) {
      logger.error("Save error:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = async (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    return await saveContent(newContent);
  };

  const resetContent = async () => {
    await saveContent(staticDefault as SiteContent);
    await refresh();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        resetContent,
        updateContent,
        isSaving,
        isLoading,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
