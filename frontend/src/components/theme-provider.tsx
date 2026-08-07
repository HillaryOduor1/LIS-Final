"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";

const ThemeProvider = function (props: ThemeProviderProps) {
  const children = props.children;
  const defaultTheme = props.defaultTheme || "system";

  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Theme;
        if (saved === "light" || saved === "dark" || saved === "system") {
          return saved;
        }
      } catch (e) {
        // Ignore
      }
      
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }
    return defaultTheme;
  };

  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const applyTheme = React.useCallback((newTheme: Theme) => {
    if (typeof window === "undefined") return;

    try {
      const root = document.documentElement;
      
      let appliedTheme: "light" | "dark";
      if (newTheme === "system") {
        appliedTheme = window.matchMedia && 
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        appliedTheme = newTheme;
      }

      // Remove all theme classes first
      root.classList.remove("light", "dark");
      
      // Apply new class
      root.classList.add(appliedTheme);
      root.setAttribute("data-theme", appliedTheme);
      
      // Force theme on body
      document.body.classList.remove("light", "dark");
      document.body.classList.add(appliedTheme);
      
      // Apply theme to all child elements via CSS
      document.body.style.backgroundColor = appliedTheme === "dark" ? "#0D2418" : "#F6F8F7";
      document.body.style.color = appliedTheme === "dark" ? "#F6F8F7" : "#123524";

      // Save preference
      localStorage.setItem(STORAGE_KEY, newTheme);

      // Force repaint
      root.offsetHeight;

    } catch (e) {
      console.error("Error applying theme:", e);
    }
  }, []);

  React.useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted, applyTheme]);

  React.useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, mounted, applyTheme]);

  const handleSetTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const value: ThemeContextValue = { 
    theme: theme, 
    setTheme: handleSetTheme 
  };

  return React.createElement(
    ThemeContext.Provider, 
    { value: value }, 
    children
  );
};

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
/*"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

// Store theme in a constant to avoid race conditions
const STORAGE_KEY = "theme";

const ThemeProvider = function (props: ThemeProviderProps) {
  const children = props.children;
  const defaultTheme = props.defaultTheme || "system";

  // Initialize with system preference immediately
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Theme;
        if (saved === "light" || saved === "dark" || saved === "system") {
          return saved;
        }
      } catch (e) {
        // Ignore
      }
      
      // Check system preference as fallback
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }
    return defaultTheme;
  };

  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);
  
  // Track if component is mounted
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme with proper synchronization
  const applyTheme = React.useCallback((newTheme: Theme) => {
    if (typeof window === "undefined") return;

    try {
      const root = document.documentElement;
      
      // Determine actual applied theme
      let appliedTheme: "light" | "dark";
      if (newTheme === "system") {
        appliedTheme = window.matchMedia && 
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        appliedTheme = newTheme;
      }

      // Remove old classes
      root.classList.remove("light", "dark");
      
      // Apply new class
      root.classList.add(appliedTheme);
      root.setAttribute("data-theme", appliedTheme);
      
      // Force theme on body as well for redundancy
      document.body.classList.remove("light", "dark");
      document.body.classList.add(appliedTheme);

      // Save preference
      localStorage.setItem(STORAGE_KEY, newTheme);

      // Force a repaint to ensure visibility
      const forceRepaint = () => {
        // Trigger reflow
        //const _ = root.offsetHeight;
      };
      forceRepaint();

    } catch (e) {
      console.error("Error applying theme:", e);
    }
  }, []);

  // Effect: Apply theme when it changes
  React.useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted, applyTheme]);

  // Effect: Listen to system preference changes
  React.useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        // Re-apply system theme
        applyTheme("system");
      }
    };

    // Add listener with proper browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, mounted, applyTheme]);

  const handleSetTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const value: ThemeContextValue = { 
    theme: theme, 
    setTheme: handleSetTheme 
  };

  return React.createElement(
    ThemeContext.Provider, 
    { value: value }, 
    children
  );
};

// Hook with error handling
function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };*/
