//import './telemetry';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from "./App";
import "./index.css";
import { ErrorBoundary } from './ErrorBoundary';

// ES5 compatibility detection and fixes (no optional chaining)
function detectES5Compatibility() {
  var isES6 = function() {
    try {
      // Test ES6 features via Function constructor
      new Function('let x = 1; const y = 2; () => {};');
      if (!window.Promise) return false;
      if (!window.Map) return false;
      if (!window.Set) return false;
      var div = document.createElement('div');
      var divStyle = div.style as any;
      var hasBackdrop = !!(divStyle.backdropFilter !== undefined ||
        divStyle.webkitBackdropFilter !== undefined ||
        (typeof CSS !== 'undefined' && CSS.supports && (
          CSS.supports('backdrop-filter', 'blur(10px)') ||
          CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
        )));
      return hasBackdrop;
    } catch(e) {
      return false;
    }
  };
  if (!isES6()) {
    document.documentElement.classList.add('es5-browser');
    var navbars = document.querySelectorAll('.navbar-backdrop');
    for (var i = 0; i < navbars.length; i++) {
      navbars[i].classList.add('no-backdrop', 'navbar-es5-fallback');
    }
    var themeButtons = document.querySelectorAll('.theme-toggle-button');
    for (var j = 0; j < themeButtons.length; j++) {
      themeButtons[j].classList.add('no-backdrop');
    }
    console.log('ES5 compatibility mode enabled');
  }
}

// Register service worker for offline capability
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('SW registered: ', registration);
      }).catch(function(error) {
        console.log('SW registration failed: ', error);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectES5Compatibility);
} else {
  detectES5Compatibility();
}
registerServiceWorker();

var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
ReactDOM.createRoot(rootElement).render(
  React.createElement(React.StrictMode, null,
    React.createElement(ErrorBoundary, null,
      React.createElement(App, null)
    )
  )
);
/*
//import './telemetry';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from "./App";
import "./index.css";
import { ErrorBoundary } from './ErrorBoundary';



// ES5 compatibility detection and fixes
function detectES5Compatibility() {
  // Check for ES6+ features
  const isES6 = (): boolean => {
    try {
      // Test for ES6 features - use Function constructor to avoid strict mode issues
      new Function('let x = 1; const y = 2; () => {};');

      // Test for modern APIs
      if (!window.Promise) return false;
      if (!window.Map) return false;
      if (!window.Set) return false;

      // Test for CSS features with type safety
      const div = document.createElement('div');
      const divStyle = div.style as any; // Use type assertion for vendor prefixes

      return !!(divStyle.backdropFilter !== undefined ||
        divStyle.webkitBackdropFilter !== undefined ||
        (typeof CSS !== 'undefined' && CSS.supports && (
          CSS.supports('backdrop-filter', 'blur(10px)') ||
          CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
        )));
    } catch (e) {
      return false;
    }
  };

  if (!isES6()) {
    // Add ES5 fallback classes
    document.documentElement.classList.add('es5-browser');

    // Fix navbar backdrop
    const navbars = document.querySelectorAll('.navbar-backdrop');
    navbars.forEach((nav: Element) => {
      nav.classList.add('no-backdrop', 'navbar-es5-fallback');
    });

    // Fix theme toggle buttons
    const themeButtons = document.querySelectorAll('.theme-toggle-button');
    themeButtons.forEach((btn: Element) => {
      btn.classList.add('no-backdrop');
    });

    console.log('ES5 compatibility mode enabled');
  }
}

// Run detection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectES5Compatibility);
} else {
  detectES5Compatibility();
}

// Create React root
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
*/