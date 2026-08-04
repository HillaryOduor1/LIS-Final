// frontend/src/main.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from "./App";
import "./index.css";
import { ErrorBoundary } from './ErrorBoundary';

function detectES5Compatibility() {
  var isES6 = function() {
    try {
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
    } catch(_e) {
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
  }
}

// Register service worker with cache cleanup
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // Check if service worker needs update
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          // Check if there's a new service worker waiting
          if (registration.waiting) {
            // New version is waiting, let the user know or auto-update
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
        return Promise.resolve();
      }).catch(function(_error) {
        // Silent fail
      });

      // Register new service worker
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .then(function(registration) {
          // Check for updates every minute
          setInterval(function() {
            registration.update().catch(function(_error) {});
          }, 60000);
          
          // Handle updates
          registration.addEventListener('updatefound', function() {
            var newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', function() {
                if (newWorker && newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available, skip waiting to activate immediately
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  // Reload to use new version
                  setTimeout(function() {
                    window.location.reload();
                  }, 1000);
                }
              });
            }
          });
        })
        .catch(function(_error) {
          // Silent fail in production
        });
    });
  }
}

// Clear old cache on version update
function clearOldCache() {
  if (import.meta.env.PROD) {
    // Clear old caches on version change
    if (caches) {
      caches.keys().then(function(cacheNames) {
        var currentVersion = 'v1'; // Update this on each build
        for (var i = 0; i < cacheNames.length; i++) {
          var cacheName = cacheNames[i];
          if (cacheName !== currentVersion && cacheName.startsWith('lis-')) {
            caches.delete(cacheName).catch(function(_error) {});
          }
        }
      }).catch(function(_error) {});
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    detectES5Compatibility();
    clearOldCache();
  });
} else {
  detectES5Compatibility();
  clearOldCache();
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

