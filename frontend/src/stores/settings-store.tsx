import * as React from "react";

// TYPES 
export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "normal" | "large" | "xlarge";
export type ButtonStyle = "rounded" | "pill" | "square" | "filled" | "outline" | "ghost" | "link";
export type UIDensity = "compact" | "comfortable" | "spacious";
export type AnimationLevel = "full" | "reduced" | "none";
export type FontFamily = "system" | "serif" | "monospace" | "custom";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: "small" | "medium" | "large";
  shadows: boolean;
  animations?: boolean;
}

export interface TypographyConfig {
  fontFamily: FontFamily;
  customFont?: string;
  fontSize: FontSize;
  lineHeight: number;
  letterSpacing: "tight" | "normal" | "wide";
  bodyWeight: "normal" | "medium" | "semibold" | "bold";
  headingWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  headingScale: "compact" | "normal" | "relaxed";
  textAlign: "left" | "center" | "right" | "justify";
}

export interface UIConfig {
  density: UIDensity;
  buttonStyle: ButtonStyle;
  animations: AnimationLevel;
}

export interface DataConfig {
  autoSave: boolean;
  saveInterval: number; // minutes
  exportFormat: "json" | "csv";
  backupEnabled: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  sound: boolean;
  desktopNotifications: boolean;
  frequency: "instant" | "daily" | "weekly";
  emailNotifications: boolean;
  pushNotifications: boolean;
  categories: string[];
}

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  textScale: number; // 0.8 - 2.0
  dyslexiaFriendly: boolean;
  largerText?: boolean;
  soundCues?: boolean;
  focusIndicators?: boolean;
  fontSize?: FontSize;
  colorVision?: "default" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
}

export interface AppSettings {
  version: number;
  theme: ThemeConfig;
  typography: TypographyConfig;
  ui: UIConfig;
  data: DataConfig;
  notifications: NotificationConfig;
  accessibility: AccessibilityConfig;
  lastUpdated: string;
}

// DEFAULTS (UPDATED TO NEW BRAND)
const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  theme: {
    mode: "system",
    primaryColor: "#123524",      // Deep Forest
    secondaryColor: "#2E7DAF",    // River Blue (accent)
    backgroundColor: "#F6F7F4",   // Warm White
    textColor: "#123524",         // Deep Forest
    borderRadius: "medium",
    shadows: true,
    animations: true,
  },
  typography: {
    fontFamily: "system",
    fontSize: "normal",
    lineHeight: 1.5,
    letterSpacing: "normal",
    bodyWeight: "normal",
    headingWeight: "bold",
    headingScale: "normal",
    textAlign: "left",
  },
  ui: {
    density: "comfortable",
    buttonStyle: "filled",
    animations: "full"
  },
  data: {
    autoSave: true,
    saveInterval: 5,
    exportFormat: "json",
    backupEnabled: true
  },
  notifications: {
    enabled: true,
    sound: true,
    desktopNotifications: false,
    frequency: "instant",
    emailNotifications: true,
    pushNotifications: false,
    categories: ["security", "updates"],
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    focusVisible: true,
    textScale: 1.0,
    dyslexiaFriendly: false,
    largerText: false,
    soundCues: false,
    focusIndicators: true,
    fontSize: "normal",
    colorVision: "default",
  },
  lastUpdated: new Date().toISOString()
};

//STORAGE MANAGER 
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/settings`;
  }
  return '/api/settings';
};

const API_URL = getApiUrl();

class StorageManager {
  private memoryCache: AppSettings | null = null;

  private getLocalStorage(): Storage | null {
    try {
      if (typeof window === "undefined") return null;
      if (!window.localStorage) return null;
      return localStorage;
    } catch (e) {
      return null;
    }
  }

  async save(settings: AppSettings): Promise<boolean> {
    try {
      this.memoryCache = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.memoryCache),
        });
        if (!response.ok) throw new Error('Backend save failed');
      } catch (e) {
        console.warn("Backend save failed, falling back to localStorage", e);
      }

      const ls = this.getLocalStorage();
      if (ls) {
        ls.setItem("app-settings", JSON.stringify(this.memoryCache));
      }

      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  }

  async load(): Promise<AppSettings> {
    if (this.memoryCache) return this.memoryCache;

    try {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const loadedSettings = await response.json();
          if (this.validateSettings(loadedSettings)) {
            const migrated = this.migrateSettings(loadedSettings);
            this.memoryCache = migrated;
            return migrated;
          }
        }
      } catch (e) {
        console.warn("Backend load failed, falling back to local storage", e);
      }

      const ls = this.getLocalStorage();
      if (ls) {
        const saved = ls.getItem("app-settings");
        if (saved) {
          const loadedSettings = JSON.parse(saved);
          if (this.validateSettings(loadedSettings)) {
            const migrated = this.migrateSettings(loadedSettings);
            this.memoryCache = migrated;
            return migrated;
          }
        }
      }

      this.memoryCache = DEFAULT_SETTINGS;
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return DEFAULT_SETTINGS;
    }
  }

  private validateSettings(settings: any): settings is AppSettings {
    return (
      settings &&
      typeof settings === "object" &&
      typeof settings.version === "number" &&
      settings.theme &&
      settings.typography &&
      settings.ui &&
      settings.data &&
      settings.notifications &&
      settings.accessibility
    );
  }

  private migrateSettings(settings: any): AppSettings {
    const currentVersion = 1;

    if (!settings.version || settings.version < currentVersion) {
      const migrated = {
        ...DEFAULT_SETTINGS,
        ...settings,
        version: currentVersion,
        lastUpdated: new Date().toISOString()
      };

      return {
        ...migrated,
        theme: {
          ...DEFAULT_SETTINGS.theme,
          ...migrated.theme,
          animations: migrated.theme.animations ?? DEFAULT_SETTINGS.theme.animations
        },
        typography: {
          ...DEFAULT_SETTINGS.typography,
          ...migrated.typography,
          bodyWeight: migrated.typography.bodyWeight ?? DEFAULT_SETTINGS.typography.bodyWeight,
          headingWeight: migrated.typography.headingWeight ?? DEFAULT_SETTINGS.typography.headingWeight,
          headingScale: migrated.typography.headingScale ?? DEFAULT_SETTINGS.typography.headingScale,
          textAlign: migrated.typography.textAlign ?? DEFAULT_SETTINGS.typography.textAlign
        },
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...migrated.notifications,
          emailNotifications: migrated.notifications.emailNotifications ?? DEFAULT_SETTINGS.notifications.emailNotifications,
          pushNotifications: migrated.notifications.pushNotifications ?? DEFAULT_SETTINGS.notifications.pushNotifications
        },
        accessibility: {
          ...DEFAULT_SETTINGS.accessibility,
          ...migrated.accessibility,
          largerText: migrated.accessibility.largerText ?? DEFAULT_SETTINGS.accessibility.largerText,
          soundCues: migrated.accessibility.soundCues ?? DEFAULT_SETTINGS.accessibility.soundCues,
          focusIndicators: migrated.accessibility.focusIndicators ?? DEFAULT_SETTINGS.accessibility.focusIndicators,
          fontSize: migrated.accessibility.fontSize ?? DEFAULT_SETTINGS.accessibility.fontSize,
          colorVision: migrated.accessibility.colorVision ?? DEFAULT_SETTINGS.accessibility.colorVision
        }
      };
    }

    return settings;
  }

  export(settings: AppSettings): string {
    const exportData = {
      ...settings,
      exportDate: new Date().toISOString(),
      app: "Sample2 App",
      formatVersion: "1.0"
    };
    return JSON.stringify(exportData, null, 2);
  }

  import(jsonString: string): { success: boolean; settings?: AppSettings; error?: string } {
    try {
      const imported = JSON.parse(jsonString);

      if (!imported.theme || !imported.typography) {
        return { success: false, error: "Invalid settings format" };
      }

      const settings: AppSettings = this.migrateSettings({
        ...DEFAULT_SETTINGS,
        ...imported,
        version: imported.version || 1,
        lastUpdated: new Date().toISOString()
      });

      this.memoryCache = settings;
      return { success: true, settings };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid JSON"
      };
    }
  }

  reset(): AppSettings {
    this.memoryCache = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  }
}

// REACT CONTEXT
interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportSettings: () => string;
  importSettings: (jsonString: string) => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  previewSettings: AppSettings | null;
  setPreviewSettings: (settings: AppSettings | null) => void;
  applyPreview: () => Promise<void>;
  discardPreview: () => void;
}

const SettingsContext = React.createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewSettings, setPreviewSettings] = React.useState<AppSettings | null>(null);

  const storageManager = React.useRef(new StorageManager());

  React.useEffect(() => {
    const loadSettings = async () => {
      const loaded = await storageManager.current.load();
      setSettings(loaded);
      applySettingsToDOM(loaded);
    };

    loadSettings();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "app-settings" && event.newValue) {
        try {
          const newSettings = JSON.parse(event.newValue);
          setSettings(newSettings);
          applySettingsToDOM(newSettings);
        } catch (e) {
          console.error("Failed to parse settings from storage event:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    applySettingsToDOM(previewSettings || settings);
  }, [settings, previewSettings]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentSettings = previewSettings || settings;
      if (currentSettings.theme.mode === "system") {
        applySettingsToDOM(currentSettings);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings, previewSettings]);

  //applySettingsToDOM 
  const applySettingsToDOM = (appSettings: AppSettings) => {
    const root = document.documentElement;

    // 1. Theme Mode (Light/Dark/System)
    let isDark = appSettings.theme.mode === "dark";
    if (appSettings.theme.mode === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    // Set dark/light classes
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = "dark";
      
      // ES5 fallback: Set direct styles on html element
      root.style.backgroundColor = "#0D2418"; // Deep forest green
      root.style.color = "#F6F8F7"; // Light text
      
      // Also set on body for older browsers
      const body = document.body;
      if (body) {
        body.style.backgroundColor = "#0D2418";
        body.style.color = "#F6F8F7";
      }
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = "light";
      
      // ES5 fallback: Set direct styles on html element
      root.style.backgroundColor = "#F6F8F7"; // Warm white
      root.style.color = "#123524"; // Deep forest text
      
      // Also set on body for older browsers
      const body = document.body;
      if (body) {
        body.style.backgroundColor = "#F6F8F7";
        body.style.color = "#123524";
      }
    }

    // 2. Set CSS variables for modern browsers
    // These work in ES6 browsers, ES5 will use the direct style assignments above
    const bgColor = isDark ? "#0D2418" : "#F6F8F7";
    const textColor = isDark ? "#F6F8F7" : "#123524";
    const surfaceColor = isDark ? "#123524" : "#ffffff";
    const borderColor = isDark ? "#2B4A3C" : "#D9DDD8";
    
    root.style.setProperty("--primary", appSettings.theme.primaryColor || "#123524");
    root.style.setProperty("--accent", appSettings.theme.secondaryColor || "#2E7DAF");
    root.style.setProperty("--bg", bgColor);
    root.style.setProperty("--text", textColor);
    root.style.setProperty("--surface", surfaceColor);
    root.style.setProperty("--border", borderColor);
    
    // Legacy color variables for backward compatibility
    root.style.setProperty("--pink-600", appSettings.theme.primaryColor || "#123524");
    root.style.setProperty("--pink-500", appSettings.theme.secondaryColor || "#2E7DAF");
    root.style.setProperty("--primary-color", appSettings.theme.primaryColor || "#123524");
    root.style.setProperty("--secondary-color", appSettings.theme.secondaryColor || "#2E7DAF");

    // 3. Border radius
    const borderRadius = ({
      small: "0.25rem",
      medium: "0.5rem",
      large: "1rem"
    } as const)[appSettings.theme.borderRadius || "medium"];
    root.style.setProperty("--border-radius", borderRadius);

    // 4. Typography
    root.style.setProperty("--font-family", getFontFamily(appSettings.typography));
    root.style.setProperty("--font-size", getFontSize(appSettings.typography.fontSize));
    root.style.setProperty("--line-height", appSettings.typography.lineHeight.toString());

    const letterSpacing = ({
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em"
    } as const)[appSettings.typography.letterSpacing || "normal"];
    root.style.setProperty("--letter-spacing", letterSpacing);

    // 5. Spacing based on density
    const spacing = getSpacing(appSettings.ui.density);
    root.style.setProperty("--spacing-unit", spacing);

    // 6. Accessibility Classes
    root.classList.toggle("reduced-motion", !!appSettings.accessibility.reducedMotion);
    root.classList.toggle("high-contrast", !!appSettings.accessibility.highContrast);
    root.classList.toggle("dyslexia-friendly", !!appSettings.accessibility.dyslexiaFriendly);

    if (appSettings.accessibility.dyslexiaFriendly) {
      root.style.setProperty("--font-family", "'OpenDyslexic', sans-serif");
    }

    root.style.setProperty("--text-scale", appSettings.accessibility.textScale.toString());

    if (appSettings.typography.bodyWeight) {
      root.style.setProperty("--body-weight", getFontWeight(appSettings.typography.bodyWeight));
    }
    if (appSettings.typography.headingWeight) {
      root.style.setProperty("--heading-weight", getFontWeight(appSettings.typography.headingWeight));
    }

    // 7. Animations
    root.classList.toggle("no-animations", appSettings.theme.animations === false);

    // 8. Dispatch custom event for favicon update
    try {
      const themeEvent = new CustomEvent('themeChanged', { 
        detail: { theme: isDark ? 'dark' : 'light' } 
      });
      document.dispatchEvent(themeEvent);
    } catch (e) {
      // ES5 fallback - use old-style event dispatch
      try {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent('themeChanged', false, false, { theme: isDark ? 'dark' : 'light' });
        document.dispatchEvent(evt);
      } catch (_) {
        // Silently fail
      }
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    setIsSaving(true);
    try {
      const newSettings = {
        ...settings,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      setSettings(newSettings);
      await storageManager.current.save(newSettings);
      applySettingsToDOM(newSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    await updateSettings({ [key]: value });
  };

  const resetToDefaults = async () => {
    const defaults = storageManager.current.reset();
    setSettings(defaults);
    await storageManager.current.save(defaults);
    applySettingsToDOM(defaults);
  };

  const exportSettings = () => storageManager.current.export(settings);

  const importSettings = async (jsonString: string) => {
    const result = storageManager.current.import(jsonString);
    if (result.success && result.settings) {
      setSettings(result.settings);
      await storageManager.current.save(result.settings);
      applySettingsToDOM(result.settings);
    }
    return result;
  };

  const applyPreview = async () => {
    if (previewSettings) {
      await updateSettings(previewSettings);
      setPreviewSettings(null);
    }
  };

  const discardPreview = () => {
    setPreviewSettings(null);
  };

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    updateSetting,
    resetToDefaults,
    exportSettings,
    importSettings,
    isSaving,
    previewSettings,
    setPreviewSettings,
    applyPreview,
    discardPreview
  };

  return React.createElement(
    SettingsContext.Provider,
    { value },
    children
  );
};

export const useSettings = function () {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// HELPER FUNCTIONS 
function getFontFamily(typography: TypographyConfig): string {
  switch (typography.fontFamily) {
    case "system":
      return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "monospace":
      return "Menlo, Monaco, 'Courier New', monospace";
    case "custom":
      return typography.customFont || "inherit";
    default:
      return "inherit";
  }
}

function getFontSize(size: FontSize): string {
  switch (size) {
    case "small": return "0.875rem";
    case "normal": return "1rem";
    case "large": return "1.125rem";
    case "xlarge": return "1.25rem";
    default: return "1rem";
  }
}

function getFontWeight(weight: string): string {
  switch (weight) {
    case "normal": return "400";
    case "medium": return "500";
    case "semibold": return "600";
    case "bold": return "700";
    case "extrabold": return "800";
    default: return "400";
  }
}

function getSpacing(density: UIDensity): string {
  switch (density) {
    case "compact": return "0.25rem";
    case "comfortable": return "0.5rem";
    case "spacious": return "1rem";
    default: return "0.5rem";
  }
}

export function getColorVisionFilter(colorVision?: string): string {
  switch (colorVision) {
    case "protanopia":
      return "url('#protanopia-filter')";
    case "deuteranopia":
      return "url('#deuteranopia-filter')";
    case "tritanopia":
      return "url('#tritanopia-filter')";
    case "achromatopsia":
      return "grayscale(100%)";
    default:
      return "none";
  }
}
