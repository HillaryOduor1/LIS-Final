import * as React from "react";
import { Moon, Sun } from "./icons";
import { useTheme } from "./theme-provider";

type Theme = "light" | "dark";

/*interface IconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}*/

export function ThemeToggle() {
  const themeContext = useTheme();
  const theme = themeContext.theme as Theme;
  const setTheme = themeContext.setTheme as (theme: Theme) => void;
  
  // Track if component is mounted to avoid hydration issues
  const [mounted, setMounted] = React.useState(false);

  // Only show toggle after mounting to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  function handleThemeToggle() {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    
    try {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      
      // Ensure DOM updates immediately
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      root.setAttribute("data-theme", newTheme);
      
      // Force repaint for visibility
      root.style.display = 'none';
      root.offsetHeight; // Trigger reflow
      root.style.display = '';
      
    } catch (e) {
      // Fallback
      document.documentElement.className = newTheme;
    }
  }

  const isDark = theme === "dark";

  // Get current theme color with proper visibility settings
  const getThemeColor = () => {
    if (isDark) {
      return {
        bg: "rgba(255, 255, 255, 0.08)",
        hover: "rgba(242, 13, 13, 0.18)", // Using ICT red for consistency
        icon: "#e5e7eb",
        border: "rgba(255, 255, 255, 0.1)"
      };
    } else {
      return {
        bg: "rgba(15, 23, 42, 0.06)",
        hover: "rgba(242, 13, 13, 0.12)",
        icon: "#0f172a",
        border: "rgba(0, 0, 0, 0.08)"
      };
    }
  };

  const themeColors = getThemeColor();

  // ES5 compatible styling
  const buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    padding: 0,
    borderRadius: "9999px",
    border: `1px solid ${themeColors.border}`,
    cursor: "pointer",
    display: "inline-flex", // Changed from flex to inline-flex for better visibility
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: themeColors.bg,
    color: themeColors.icon,
    // Force visibility
    visibility: "visible",
    opacity: 1,
    position: "relative",
    zIndex: 50,
    // Prevent shrinking
    flexShrink: 0,
    flexGrow: 0,
    // Ensure it's not hidden
    overflow: "visible"
  };

  const iconProps = {
    className: "h-5 w-5",
    color: themeColors.icon,
    style: { 
      color: themeColors.icon,
      width: "20px",
      height: "20px",
      display: "block" // Ensure icon is visible
    }
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return React.createElement(
    "button",
    {
      onClick: handleThemeToggle,
      className: "theme-toggle-button",
      style: buttonStyle,
      title: `Switch to ${isDark ? "light" : "dark"} mode`,
      "aria-label": `Switch to ${isDark ? "light" : "dark"} mode`,
      onMouseEnter: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.hover;
        e.currentTarget.style.transform = "scale(1.05)";
      },
      onMouseLeave: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.bg;
        e.currentTarget.style.transform = "scale(1)";
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
