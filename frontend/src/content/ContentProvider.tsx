// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

// ✅ Use full backend URL from environment, fallback to relative path for local dev
const API_BASE = import.meta.env.VITE_API_URL || "";
const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";
const API_URL = `${API_BASE}/api/content?tenant=${TENANT}`;

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
