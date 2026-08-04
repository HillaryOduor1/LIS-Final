import React from 'react';
import { useContent } from '../content/useContext';

interface ThemeConfig {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  typography?: {
    fontFamily?: string;
    headingWeight?: string;
    bodyWeight?: string;
    textScale?: number;
    textAlign?: string;
  };
  spacing?: {
    spacingUnit?: string;
    radius?: string;
    shadowIntensity?: string;
  };
}

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const { content } = useContent();
  const theme = (content?.theme as ThemeConfig) || {};
  
  // Track if component is mounted
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    // Only run after mounting to avoid hydration issues
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Clear any existing dynamic theme styles first
    const existingStyle = document.getElementById('dynamic-dark-theme');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Apply light mode variables
    if (theme.light) {
      Object.entries(theme.light).forEach(([key, value]) => {
        if (value) root.style.setProperty(`--${key}`, value);
      });
    }
    
    // Apply dark mode variables - using inline style instead of dynamic style tag
    if (theme.dark && Object.keys(theme.dark).length > 0) {
      // Create a style element for dark theme overrides
      const styleEl = document.createElement('style');
      styleEl.id = 'dynamic-dark-theme';
      
      let darkStyles = '.dark {';
      Object.entries(theme.dark).forEach(([key, value]) => {
        if (value) {
          darkStyles += `--${key}: ${value} !important;`;
        }
      });
      darkStyles += '}';
      
      styleEl.textContent = darkStyles;
      document.head.appendChild(styleEl);
    }
    
    // Typography
    if (theme.typography) {
      if (theme.typography.fontFamily) root.style.setProperty('--font-family', theme.typography.fontFamily);
      if (theme.typography.headingWeight) root.style.setProperty('--weight-heading', theme.typography.headingWeight);
      if (theme.typography.bodyWeight) root.style.setProperty('--weight-body', theme.typography.bodyWeight);
      if (theme.typography.textScale !== undefined) root.style.setProperty('--text-scale', theme.typography.textScale.toString());
      if (theme.typography.textAlign) root.style.setProperty('--text-align', theme.typography.textAlign);
    }
    
    // Spacing
    if (theme.spacing) {
      if (theme.spacing.spacingUnit) root.style.setProperty('--spacing-unit', theme.spacing.spacingUnit);
      if (theme.spacing.radius) root.style.setProperty('--radius', theme.spacing.radius);
      if (theme.spacing.shadowIntensity) root.style.setProperty('--shadow-intensity', theme.spacing.shadowIntensity);
    }
    
    // Force visibility of theme toggle after theme changes
    const toggleButton = document.querySelector('.theme-toggle-button') as HTMLElement;
    if (toggleButton) {
      toggleButton.style.visibility = 'visible';
      toggleButton.style.opacity = '1';
      toggleButton.style.display = 'inline-flex';
    }
    
  }, [theme, mounted]);

  return <>{children}</>;
}
  