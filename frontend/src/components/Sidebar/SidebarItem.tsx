import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}

export default function SidebarItem({ icon, label, href, onClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  const hasHash = href.indexOf('#') !== -1;

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (hasHash) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
          isActive 
            ? 'bg-primary text-[#0d1b14] font-semibold' 
            : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
        }`}
        aria-current={isActive ? 'location' : undefined}
      >
        {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
        isActive 
          ? 'bg-primary text-[#0d1b14] font-semibold' 
          : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
/*
// src/components/Sidebar/SidebarItem.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}

export default function SidebarItem({ icon, label, href, onClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || (href.includes('#') && location.pathname === '/');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // For anchor links (with #)
  if (href.includes('#')) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-primary text-[#0d1b14] font-semibold' 
            : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
        }`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  // For regular routes
  return (
    <Link
      to={href}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-primary text-[#0d1b14] font-semibold' 
          : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
      }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}*/
