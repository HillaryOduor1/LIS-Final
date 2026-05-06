import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "../content/useContext";
import { ThemeToggle } from "./themeToggle";
import { MenuIcon } from "./icons";
import { trackEvent } from '../analytics';

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { content } = useContent();
  const location = useLocation();
  const navlinks: NavLink[] = (content?.navigation as NavLink[]) || [];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      e.preventDefault();
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setIsSidebarOpen(false);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-black/10 dark:hover:bg-white/10 md:hidden"
          >
            <MenuIcon width={22} height={22} />
          </button>

          <Link to="/" className="flex items-center gap-3" onClick={() => trackEvent('logo_click')}>
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0d1b14] dark:text-white">LIS</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navlinks.map((link) => (
            link.href.includes("#") ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  scrollToSection(e, link.href);
                  trackEvent('nav_click', { link: link.name });
                }}
                className={`text-sm font-semibold hover:text-primary transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'
                }`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => trackEvent('nav_click', { link: link.name })}
                className={`text-sm font-semibold hover:text-primary transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button 
            className="hidden md:block bg-primary hover:bg-primary/90 text-[#0d1b14] px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
            onClick={() => trackEvent('contact_button_click')}
          >
            Contact Us
          </button>

          <button 
            className="md:hidden bg-primary hover:bg-primary/90 text-[#0d1b14] px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
            onClick={() => trackEvent('contact_button_click_mobile')}
          >
            Contact
          </button>

          <Link to="/login" onClick={() => trackEvent('click_login')}>
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
/*import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "../content/useContext";
import { ThemeToggle } from "./themeToggle";
import { MenuIcon } from "./icons";
import { trackEvent } from '../analytics';

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { content } = useContent();
  const location = useLocation();
  const navlinks = content?.navigation || [];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      e.preventDefault();
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setIsSidebarOpen(false);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT SIDE: MOBILE MENU + LOGO /}
        <div className="flex items-center gap-4">
          {/* MOBILE MENU BUTTON - Only visible on mobile /}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-black/10 dark:hover:bg-white/10 md:hidden"
          >
            <MenuIcon width={22} height={22} />
          </button>

          {/* LOGO /}
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0d1b14] dark:text-white">LIS</h1>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION - Only visible on desktop /}
        <div className="hidden md:flex items-center gap-8">
          {navlinks.map((link) => (
            link.href.includes("#") ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-sm font-semibold hover:text-primary transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'
                }`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-semibold hover:text-primary transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* RIGHT SIDE: ACTIONS /}
        <div className="flex items-center gap-4">
          {/* THEME TOGGLE /}
          <ThemeToggle />

          {/* CONTACT BUTTON - Desktop /}
          <button className="hidden md:block bg-primary hover:bg-primary/90 text-[#0d1b14] px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm">
            Contact Us
          </button>

          {/* MOBILE CONTACT BUTTON - Only visible on mobile /}
          <button className="md:hidden bg-primary hover:bg-primary/90 text-[#0d1b14] px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm">
            Contact
          </button>

          {/* USER PROFILE / LOGIN /}
          <Link to="/login" onClick={() => trackEvent('click_login')}>
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}*/