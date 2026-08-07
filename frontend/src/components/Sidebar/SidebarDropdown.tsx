import * as React from "react";
import SidebarItem from "./SidebarItem";

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  
  // Check for dark mode (ES5 safe)
  var isDarkMode = false;
  if (typeof document !== "undefined") {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  var textColor = isDarkMode ? '#F6F8F7' : '#0d1b14';

  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0");

  function handleToggle() {
    triggerHaptic();
    props.onToggle();
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md sidebar-link transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-controls={"dropdown-" + props.name}
        style={{ color: textColor }}
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5" aria-hidden="true">{props.icon}</span>
          <span>{props.label}</span>
        </div>
        <span className={"transition-transform duration-200 " + (isOpen ? 'rotate-180' : '')} style={{ color: textColor }}>▼</span>
      </button>
      <div id={"dropdown-" + props.name} className={dropdownClass}>
        {props.items.map(function(item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.path}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}
/*import * as React from "react";
import SidebarItem from "./SidebarItem";

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0");

  return (
    <div className="flex flex-col">
      <button
        onClick={props.onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md sidebar-link transition-colors hover:bg-pink-500/10 dark:hover:bg-pink-500/20 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-controls={"dropdown-" + props.name}
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5" aria-hidden="true">{props.icon}</span>
          <span>{props.label}</span>
        </div>
        <span className={"transition-transform duration-200 " + (isOpen ? 'rotate-180' : '')}>▼</span>
      </button>
      <div id={"dropdown-" + props.name} className={dropdownClass}>
        {props.items.map(function(item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.path}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}*/


/*import * as React from "react";
import SidebarItem from "./SidebarItem";

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0");

  return (
    <div className="flex flex-col">
      <button
        onClick={props.onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md sidebar-link transition-colors hover:bg-pink-500/10 dark:hover:bg-pink-500/20 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${props.name}`}
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5" aria-hidden="true">{props.icon}</span>
          <span>{props.label}</span>
        </div>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div id={`dropdown-${props.name}`} className={dropdownClass}>
        {props.items.map(function (item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.path}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}*/
