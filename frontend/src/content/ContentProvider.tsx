// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

const API_BASE = "/api";
const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";
const API_URL = `${API_BASE}/content?tenant=${TENANT}`;
const CACHE_TTL = 1 * 60 * 1000; // 5 minutes
const CACHE_KEY = "site_content_cache";

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadContent = React.useCallback(async (force = false) => {
    // Check cache
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp }: CacheEntry = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setContent(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // invalid JSON, ignore
        }
      }
    }

    setIsLoading(true);
    let response: Response | undefined;
    try {
      response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 200));
        throw new Error("Backend did not return JSON");
      }

      const data = await response.json();
      const loadedContent = (Array.isArray(data) ? data[0] : data) as SiteContent;
      if (loadedContent && Object.keys(loadedContent).length > 0) {
        setContent(loadedContent);
        const cacheEntry: CacheEntry = { data: loadedContent, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      } else {
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      console.error("Failed to load content, using static fallback", error);
      // Debug: log raw response text if available
      if (response) {
        try {
          const text = await response.text();
          console.error("Raw backend response:", text.slice(0, 500));
        } catch (e) {}
      }
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = React.useCallback(() => loadContent(true), [loadContent]);

  React.useEffect(() => {
    const handleContentUpdated = () => refresh();
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [refresh]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Save failed");
      setContent(newContent);
      const cacheEntry: CacheEntry = { data: newContent, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      // Notify listeners
      window.dispatchEvent(new Event("content-updated"));
      return true;
    } catch (error) {
      console.error("Save error:", error);
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
/*
// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

const API_URL = "/api/content";            // relative, works with Vite proxy
const CACHE_TTL = 5 * 60 * 1000;          // 5 minutes
const CACHE_KEY = "site_content_cache";

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Load content from cache or API
  const loadContent = React.useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp }: CacheEntry = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setContent(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // invalid cache, ignore
        }
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const loadedContent = (Array.isArray(data) ? data[0] : data) as SiteContent;
        if (loadedContent && Object.keys(loadedContent).length > 0) {
          setContent(loadedContent);
          // Save to cache
          const cacheEntry: CacheEntry = {
            data: loadedContent,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
        } else {
          setContent(staticDefault as SiteContent);
        }
      } else {
        console.warn("API returned error, using static fallback");
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      console.error("Failed to load content, using static fallback", error);
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh (force reload)
  const refresh = React.useCallback(() => loadContent(true), [loadContent]);

  // Listen for content-updated event from admin CMS
  React.useEffect(() => {
    const handleContentUpdated = () => refresh();
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [refresh]);

  // Initial load
  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Save content to backend
  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Save failed");
      setContent(newContent);
      // Update cache
      const cacheEntry: CacheEntry = {
        data: newContent,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      return true;
    } catch (error) {
      console.error("Save error:", error);
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
    await refresh(); // reload fresh from API
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
}*/

/*
// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault, SiteContent } from "./defaultContent";

const API_URL = "/api/content"; // relative, works with Vite proxy

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadContent = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const loadedContent = Array.isArray(data) ? data[0] : data;
        if (loadedContent && Object.keys(loadedContent).length > 0) {
          setContent(loadedContent);
        } else {
          setContent(staticDefault);
        }
      } else {
        console.warn("API returned error, using static fallback");
        setContent(staticDefault);
      }
    } catch (error) {
      console.error("Failed to load content, using static fallback", error);
      setContent(staticDefault);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Save failed");
      setContent(newContent);
      return true;
    } catch (error) {
      console.error("Save error:", error);
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
    await saveContent(staticDefault);
    await loadContent(); // reload fresh from API
  };

  return (
    <ContentContext.Provider
      value={{ content, setContent, resetContent, updateContent, isSaving, isLoading }}
    >
      {children}
    </ContentContext.Provider>
  );
}
*/
/*import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent } from "./defaultContent";
import type { SiteContent } from "./defaultContent";

const API_URL = "http://localhost:5000/api/content";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Load content from Backend
  React.useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const loadedContent = await response.json();
          if (loadedContent && Object.keys(loadedContent).length > 0) {
            setContent(mergeDefaults(loadedContent, defaultContent));
          }
        }
      } catch (error) {
        console.error("Failed to load content from backend, using defaults.", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Merge defaults with saved content
  function mergeDefaults(saved: Partial<SiteContent>, defaults: SiteContent): SiteContent {
    return {
      ...defaults,
      ...saved,
      hero: { ...defaults.hero, ...(saved.hero ?? {}) },
      contact: { ...defaults.contact, ...(saved.contact ?? {}) },
      cta: { ...defaults.cta, ...(saved.cta ?? {}) },
      features: saved.features ?? defaults.features,
      pricing: saved.pricing ?? defaults.pricing,
      testimonials: saved.testimonials ?? defaults.testimonials,
      footer: saved.footer ?? defaults.footer,
      navigation: saved.navigation ?? defaults.navigation,
    };
  }

  // Save content to Backend
  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      if (!response.ok) throw new Error('Failed to save to backend');
      setContent(newContent);
      return true;
    } catch (error) {
      console.error("Failed to save content:", error);
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
    await saveContent(defaultContent);
  };

  return (
    <ContentContext.Provider value={{ content, setContent, resetContent, updateContent, isSaving }}>
      {children}
    </ContentContext.Provider>
  );
}
*/


