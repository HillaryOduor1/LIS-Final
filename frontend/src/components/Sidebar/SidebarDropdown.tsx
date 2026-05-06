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

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;

  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0");

  return (
    <div className="flex flex-col">
      <button
        onClick={props.onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md sidebar-link transition-colors hover:bg-pink-500/10 dark:hover:bg-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5">{props.icon}</span>
          <span>{props.label}</span>
        </div>
      </button>

      <div className={dropdownClass}>
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
}



