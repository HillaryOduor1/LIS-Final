
// src/components/Sidebar/Sidebar.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { navlinks } from "../../data/navlinks";
//import SettingsButton from "../settings/SettingsButton";
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
  const mobileNavlinks: typeof navlinks = (content.navigation as typeof navlinks) || navlinks; // Use content navigation if available

  // Close on outside click for mobile
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <React.Fragment>
      {/* Overlay - Only shows when sidebar is open on mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Panel - Mobile only */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 h-full w-[280px] z-[101] flex flex-col p-6 transition-transform duration-300 ease-in-out border-r border-border bg-white dark:bg-background-dark shadow-xl md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link to="/" className="flex items-center gap-2" onClick={toggleSidebar}>
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="font-bold text-xl text-[#0d1b14] dark:text-white">LIS</span>
          </Link>

          {/* Close button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-[#0d1b14] dark:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex-grow flex flex-col gap-1">
          {mobileNavlinks.map((link, idx) => (
            <SidebarItem
              key={idx}
              icon={link.icon}
              label={link.name}
              href={link.href}
              onClick={() => {
                toggleSidebar();
              }}
            />
          ))}

          <div className="mt-4 pt-4 border-t border-primary/10">
            <button className="w-full bg-primary hover:bg-primary/90 text-[#0d1b14] font-bold py-3 rounded-lg transition-all">
              Contact Us
            </button>
          </div>
        </nav>

        <SidebarFooter />
      </aside>
    </React.Fragment>
  );
}
