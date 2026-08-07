import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function SidebarItem(props: SidebarItemProps) {
  var icon = props.icon;
  var label = props.label;
  var href = props.href;
  var onClick = props.onClick;
  
  var location = useLocation();
  var isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  var hasHash = href.indexOf('#') !== -1;

  // Check for dark mode (ES5 safe)
  var isDarkMode = false;
  if (typeof document !== "undefined") {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  var textColor = isDarkMode ? '#F6F8F7' : '#0d1b14';

  function handleClick() {
    triggerHaptic();
    if (onClick) onClick();
  }

  var className = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary " +
    (isActive 
      ? 'bg-primary text-white font-semibold' 
      : 'hover:bg-primary/10');

  var itemStyle = {
    color: isActive ? '#ffffff' : textColor
  };

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} style={itemStyle} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} style={itemStyle} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
/*import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}

export default function SidebarItem(props: SidebarItemProps) {
  var icon = props.icon;
  var label = props.label;
  var href = props.href;
  var onClick = props.onClick;
  
  var location = useLocation();
  var isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  var hasHash = href.indexOf('#') !== -1;

  function handleClick() {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    if (onClick) onClick();
  }

  var className = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary " +
    (isActive 
      ? 'bg-primary text-[#0d1b14] font-semibold' 
      : 'text-[#0d1b14] dark:text-white hover:bg-primary/10');

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}*/


/*import * as React from "react";
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
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    if (onClick) onClick();
  };

  const className = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
    isActive 
      ? 'bg-primary text-[#0d1b14] font-semibold' 
      : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
  }`;

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}*/
