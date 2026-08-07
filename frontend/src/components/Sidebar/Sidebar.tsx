// src/components/Sidebar/Sidebar.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { navlinks } from "../../data/navlinks";
import { useContent } from "../../content/useContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: string;
}

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function Sidebar(props: SidebarProps) {
  var isOpen = props.isOpen;
  var toggleSidebar = props.toggleSidebar;
  var sidebarRef = React.useRef<HTMLDivElement | null>(null);
  var { content } = useContent();
  var mobileNavlinks = (content && content.navigation) ? (content.navigation) : navlinks;

  // Check for dark mode (ES5 safe)
  var isDarkMode = false;
  if (typeof document !== "undefined") {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  // Theme-aware background colors
  var sidebarBgColor = isDarkMode ? '#0D2418' : '#F6F8F7';
  var sidebarTextColor = isDarkMode ? '#F6F8F7' : '#0d1b14';
  var sidebarBorderColor = isDarkMode ? '#2B4A3C' : '#D9DDD8';

  // Close on outside click
  React.useEffect(function() {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // Close on Escape key
  React.useEffect(function() {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return function() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toggleSidebar]);

  // Prevent body scroll
  React.useEffect(function() {
    if (isOpen) {
      var scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      var scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [isOpen]);

  // Swipe left to close (on touch devices)
  React.useEffect(function() {
    var touchStartX = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].clientX;
    }
    function onTouchMove(e: TouchEvent) {
      if (!isOpen) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        toggleSidebar();
      }
    }
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return function() {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen, toggleSidebar]);

  // Haptic feedback on open (ES5 safe)
  function handleToggle() {
    triggerHaptic();
    toggleSidebar();
  }

  // Determine overlay and sidebar classes
  var overlayClasses = "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden " + 
    (isOpen ? "opacity-100" : "opacity-0 pointer-events-none");

  var sidebarClasses = "fixed top-0 h-full w-[280px] z-[101] flex flex-col p-6 transition-transform duration-300 ease-in-out border-r shadow-xl md:hidden sidebar-solid-fallback " + 
    (isOpen ? "translate-x-0" : "-translate-x-full");

  return (
    <React.Fragment>
      {/* Overlay */}
      <div
        className={overlayClasses}
        onClick={handleToggle}
        aria-hidden="true"
      />
      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={sidebarClasses}
        style={{ 
          height: '100dvh',
          backgroundColor: sidebarBgColor,
          color: sidebarTextColor,
          borderColor: sidebarBorderColor
        }}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={handleToggle}>
            <div className="size-8">
              <img 
                src="/assets/footer-logo-light.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain block dark:hidden"
              />
              <img 
                src="/assets/footer-logo-dark.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="font-bold text-xl" style={{ color: sidebarTextColor }}>LIS</span>
          </Link>
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg bg-transparent hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close sidebar"
            style={{ color: sidebarTextColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="flex-grow flex flex-col gap-1" aria-label="Mobile navigation">
           {mobileNavlinks.map(function(link, idx) {
              return (
                <SidebarItem
                  key={idx}
                  icon={<span className="material-symbols-outlined text-xl">{link.icon}</span>}
                  label={link.name}
                  href={link.href}
                  onClick={function() { handleToggle(); }}
                />
              );
            })}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <button className="w-full bg-primary hover:bg-primary/90 font-bold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" style={{ color: '#ffffff' }}>
              Contact Us
            </button>
          </div>
        </nav>
        <SidebarFooter />
      </aside>
    </React.Fragment>
  );
}
/*// src/components/Sidebar/Sidebar.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { navlinks } from "../../data/navlinks";
import { useContent } from "../../content/useContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: string;
}

export default function Sidebar(props: SidebarProps) {
  var isOpen = props.isOpen;
  var toggleSidebar = props.toggleSidebar;
  var sidebarRef = React.useRef<HTMLDivElement | null>(null);
  var { content } = useContent();
  var mobileNavlinks = (content && content.navigation) ? (content.navigation) : navlinks;

  // Close on outside click
  React.useEffect(function() {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // Close on Escape key
  React.useEffect(function() {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return function() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toggleSidebar]);

  // Prevent body scroll
  React.useEffect(function() {
    if (isOpen) {
      var scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      var scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [isOpen]);

  // Swipe left to close (on touch devices)
  React.useEffect(function() {
    var touchStartX = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].clientX;
    }
    function onTouchMove(e: TouchEvent) {
      if (!isOpen) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        toggleSidebar();
      }
    }
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return function() {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen, toggleSidebar]);

  // Haptic feedback on open (ES5 safe)
  function handleToggle() {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    toggleSidebar();
  }

  // Determine overlay and sidebar classes
  var overlayClasses = "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden " + 
    (isOpen ? "opacity-100" : "opacity-0 pointer-events-none");

  var sidebarClasses = "fixed top-0 h-full w-[280px] z-[101] flex flex-col p-6 transition-transform duration-300 ease-in-out border-r border-border bg-white dark:bg-background-dark shadow-xl md:hidden sidebar-solid-fallback " + 
    (isOpen ? "translate-x-0" : "-translate-x-full");

  return (
    <React.Fragment>
      {/* Overlay /}
      <div
        className={overlayClasses}
        onClick={handleToggle}
        aria-hidden="true"
      />
      {/* Sidebar Panel /}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={sidebarClasses}
        style={{ height: '100dvh' }}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={handleToggle}>
            <div className="size-8">
              <img 
                src="/assets/footer-logo-light.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain block dark:hidden"
              />
              <img 
                src="/assets/footer-logo-dark.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="font-bold text-xl text-[#0d1b14] dark:text-white">LIS</span>
          </Link>
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-[#0d1b14] dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="flex-grow flex flex-col gap-1" aria-label="Mobile navigation">
           {mobileNavlinks.map(function(link, idx) {
              return (
                <SidebarItem
                  key={idx}
                  icon={<span className="material-symbols-outlined text-xl">{link.icon}</span>}
                  label={link.name}
                  href={link.href}
                  onClick={function() { handleToggle(); }}
                />
              );
            })}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <button className="w-full bg-primary hover:bg-primary/90 text-[#0d1b14] font-bold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Contact Us
            </button>
          </div>
        </nav>
        <SidebarFooter />
      </aside>
    </React.Fragment>
  );
}*/


/*
// src/components/Sidebar/Sidebar.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { navlinks } from "../../data/navlinks";
import { useContent } from "../../content/useContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: string;
}

export default function Sidebar(props: SidebarProps) {
  const { isOpen, toggleSidebar } = props;
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const { content } = useContent();
  const mobileNavlinks = (content && content.navigation) ? (content.navigation as typeof navlinks) : navlinks;

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSidebar]);

  // Prevent body scroll
  React.useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [isOpen]);

  // Swipe left to close (on touch devices)
  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].clientX; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) { // swipe left
        toggleSidebar();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen, toggleSidebar]);

  // Haptic feedback on open (ES5 safe)
  const handleToggle = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    toggleSidebar();
  };

  return (
    <React.Fragment>
      {/* Overlay /}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleToggle}
        aria-hidden="true"
      />
      {/* Sidebar Panel /}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 h-full w-[280px] z-[101] flex flex-col p-6 transition-transform duration-300 ease-in-out border-r border-border bg-white dark:bg-background-dark shadow-xl md:hidden sidebar-solid-fallback ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: '100dvh' }} // modern viewport unit
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={handleToggle}>
            <div className="size-8">
              <img 
                src="/assets/footer-logo-light.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain block dark:hidden"
              />
              <img 
                src="/assets/footer-logo-dark.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="font-bold text-xl text-[#0d1b14] dark:text-white">LIS</span>
          </Link>
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-[#0d1b14] dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="flex-grow flex flex-col gap-1" aria-label="Mobile navigation">
           {mobileNavlinks.map(function(link, idx) {
              return (
                <SidebarItem
                  key={idx}
                  icon={<span className="material-symbols-outlined text-xl">{link.icon}</span>}
                  label={link.name}
                  href={link.href}
                  onClick={function() { handleToggle(); }}
                />
              );
            })}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <button className="w-full bg-primary hover:bg-primary/90 text-[#0d1b14] font-bold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Contact Us
            </button>
          </div>
        </nav>
        <SidebarFooter />
      </aside>
    </React.Fragment>
  );
}*/
