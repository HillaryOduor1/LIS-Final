/*
import { Sun, Moon, Monitor } from "./icons";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  let Icon = Sun;
  let label = "Switch to dark mode";
  if (theme === "dark") {
    Icon = Moon;
    label = "Switch to system mode";
  } else if (theme === "system") {
    Icon = Monitor;
    label = "Switch to light mode";
  }

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle-button p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      title={label}
      aria-label={label}
    >
      <Icon size={20} />
    </button>
  );
}*/

/*import * as React from "react";
import { Moon, Sun } from "./icons";
import { useTheme } from "./theme-provider";

type Theme = "light" | "dark";

interface IconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export function ThemeToggle() {
  var themeContext = useTheme();
  var theme = themeContext.theme as Theme;
  var setTheme = themeContext.setTheme as (theme: Theme) => void;
  var isDark = theme === "dark";

  function handleThemeToggle() {
    var newTheme: Theme = isDark ? "light" : "dark";
    setTheme(newTheme);
    // Haptic feedback on mobile
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }

  var buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
    color: isDark ? "#e5e7eb" : "#0f172a"
  };

  return React.createElement(
    "button",
    {
      onClick: handleThemeToggle,
      className: "theme-toggle-button",
      style: buttonStyle,
      title: "Switch to " + (isDark ? "light" : "dark") + " mode",
      "aria-label": "Switch to " + (isDark ? "light" : "dark") + " mode",
      "aria-pressed": isDark,
      onMouseEnter: function(e) { e.currentTarget.style.backgroundColor = isDark ? "rgba(236,72,153,0.18)" : "rgba(236,72,153,0.12)"; },
      onMouseLeave: function(e) { e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"; },
      onMouseDown: function(e) { e.currentTarget.style.transform = "scale(0.95)"; },
      onMouseUp: function(e) { e.currentTarget.style.transform = "scale(1)"; }
    },
    isDark ? React.createElement(Sun, { className: "h-5 w-5" }) : React.createElement(Moon, { className: "h-5 w-5" })
  );
}*/


import * as React from "react";
import { Moon, Sun } from "./icons";
import { useTheme } from "./theme-provider";

// Define theme type if not already defined
type Theme = "light" | "dark";

// Props for icon components (adjust based on your actual icon component props)
interface IconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export function ThemeToggle() {
  var themeContext = useTheme();
  var theme = themeContext.theme as Theme;
  var setTheme = themeContext.setTheme as (theme: Theme) => void;

  function handleThemeToggle() {
    var newTheme: Theme = theme === "light" ? "dark" : "light";
    
    // ES5 compatible theme setting
    try {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.className = newTheme;
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (e) {
      // Fallback for ES5
      document.documentElement.className = newTheme;
    }
  }

  var isDark = theme === "dark";

  // Get current theme color for background - matches navbar
  const getThemeColor = () => {
    if (isDark) {
      return {
        bg: "rgba(255, 255, 255, 0.08)",
        hover: "rgba(236, 72, 153, 0.18)",
        icon: "#e5e7eb"
      };
    } else {
      return {
        bg: "rgba(15, 23, 42, 0.06)",
        hover: "rgba(236, 72, 153, 0.12)",
        icon: "#0f172a"
      };
    }
  };

  const themeColors = getThemeColor();

  // ES5 compatible styling based on theme
  var buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    padding: 0,
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: themeColors.bg,
    color: themeColors.icon
  };

  // Icon props - pass color as a prop if supported, otherwise use style
  const iconProps = {
    className: "h-5 w-5",
    // If your icon components accept a color prop, use this:
    color: themeColors.icon,
    // If they don't accept color prop but accept style, use this instead:
    // style: { color: themeColors.icon } as React.CSSProperties
  };

  return React.createElement(
    "button",
    {
      onClick: handleThemeToggle,
      className: "theme-toggle-button",
      style: buttonStyle,
      title: "Switch to " + (isDark ? "light" : "dark") + " mode",
      "aria-label": "Switch to " + (isDark ? "light" : "dark") + " mode",
      onMouseEnter: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.hover;
      },
      onMouseLeave: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.bg;
      },
      onMouseDown: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.transform = "scale(0.95)";
      },
      onMouseUp: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.transform = "scale(1)";
      }
    },
    isDark
      ? React.createElement(Sun, iconProps)
      : React.createElement(Moon, iconProps)
  );
}