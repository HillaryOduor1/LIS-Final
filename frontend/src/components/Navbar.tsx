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

export default function Navbar(props: NavbarProps) {
  var isSidebarOpen = props.isSidebarOpen;
  var setIsSidebarOpen = props.setIsSidebarOpen;
  var { content } = useContent();
  var location = useLocation();
  var navlinks = (content && content.navigation) ? (content.navigation as NavLink[]) : [];

  function isActive(path: string) {
    return location.pathname === path;
  }

  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.indexOf("#") !== -1) {
      e.preventDefault();
      var id = href.split("#")[1];
      var element = document.getElementById(id);
      if (element) {
        var offset = 80;
        var bodyRect = document.body.getBoundingClientRect().top;
        var elementRect = element.getBoundingClientRect().top;
        var elementPosition = elementRect - bodyRect;
        var offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
      setIsSidebarOpen(false);
    }
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 navbar-fallback">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={isSidebarOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md transition bg-transparent hover:bg-black/10 dark:hover:bg-white/10 md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <MenuIcon width={22} height={22} />
          </button>
          <Link to="/" className="flex items-center gap-3" onClick={function() { trackEvent('logo_click'); }}>
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
            <h1 className="text-xl font-extrabold tracking-tight text-[#0d1b14] dark:text-white">
              <span className="hidden sm:inline">Landscapes Integrity Solutions</span>
              <span className="sm:hidden">LIS</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navlinks.map(function(link) {
            if (link.href.indexOf("#") !== -1) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={function(e) { scrollToSection(e, link.href); trackEvent('nav_click', { link: link.name }); }}
                  className={"text-sm font-semibold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 " + (isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white')}
                >
                  {link.name}
                </a>
              );
            } else {
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={function() { trackEvent('nav_click', { link: link.name }); }}
                  className={"text-sm font-semibold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 " + (isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white')}
                >
                  {link.name}
                </Link>
              );
            }
          })}
        </div>

        {/* Right: Theme Toggle with container */}
        <div className="flex items-center justify-end min-w-[44px]">
          <ThemeToggle />
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
  const navlinks = (content && content.navigation) ? (content.navigation as NavLink[]) : [];

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.indexOf("#") !== -1) {
      e.preventDefault();
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
      setIsSidebarOpen(false);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 navbar-fallback">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Hamburger + Logo /}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={isSidebarOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md transition bg-transparent hover:bg-black/10 dark:hover:bg-white/10 md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <MenuIcon width={22} height={22} />
          </button>
          <Link to="/" className="flex items-center gap-3" onClick={() => trackEvent('logo_click')}>
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
            <h1 className="text-xl font-extrabold tracking-tight text-[#0d1b14] dark:text-white">
              <span className="hidden sm:inline">Landscapes Integrity Solutions</span>
              <span className="sm:hidden">LIS</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation *}
        <div className="hidden md:flex items-center gap-8">
          {navlinks.map((link) => (
            link.href.indexOf("#") !== -1 ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { scrollToSection(e, link.href); trackEvent('nav_click', { link: link.name }); }}
                className={`text-sm font-semibold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 ${isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'}`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => trackEvent('nav_click', { link: link.name })}
                className={`text-sm font-semibold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 ${isActive(link.href) ? 'text-primary' : 'text-[#0d1b14] dark:text-white'}`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Right: Theme Toggle only /}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}*/
