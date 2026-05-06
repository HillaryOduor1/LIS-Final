import * as React from "react";
import {
  SettingsIcon,
  CloseIcon,
  ResetIcon,
  PaletteIcon,
  AccessibilityIcon,
  BellIcon,
  TypeIcon,
  DatabaseIcon,
  UploadIcon,
  Monitor,
  AlertTriangle,
  LogOutIcon
} from "../icons";
import { useSettings } from "../../stores/settings-store";
import { useAuth } from "../../context/AuthContext";

// Import all tab components
import { AppearanceTab } from "./tabs/AppearanceTab";
import { AccessibilityTab } from "./tabs/AccessibilityTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { DataTab } from "./tabs/DataTab";
import { ImportExportTab } from "./tabs/ImportExportTab";
import { TypographyTab } from "./tabs/TypographyTab";
import { UITab } from "./tabs/UiTab";
import { DashboardTab } from "./tabs/DashboardTab";
import { SystemStatusTab } from "./tabs/SystemStatusTab";
import { CmsContentTab } from "./tabs/CmsContentTab";
import LogoutModal from "./LogoutModal";

// ---------------- Tabs Configuration ----------------
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const TABS: Tab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Monitor size={18} />,
    component: DashboardTab,
  },
  {
    id: "status",
    label: "System Status",
    icon: <AlertTriangle size={18} />,
    component: SystemStatusTab,
  },
  {
    id: "content",
    label: "Content",
    icon: <DatabaseIcon size={18} />,
    component: CmsContentTab,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: <PaletteIcon size={18} />,
    component: AppearanceTab,
  },
  {
    id: "typography",
    label: "Typography",
    icon: <TypeIcon size={18} />,
    component: TypographyTab,
  },
  {
    id: "ui",
    label: "UI",
    icon: <SettingsIcon size={18} />,
    component: UITab,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: <AccessibilityIcon size={18} />,
    component: AccessibilityTab,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <BellIcon size={18} />,
    component: NotificationsTab,
  },
  {
    id: "data",
    label: "Data",
    icon: <DatabaseIcon size={18} />,
    component: DataTab,
  },
  {
    id: "import-export",
    label: "Import/Export",
    icon: <UploadIcon size={18} />,
    component: ImportExportTab,
  },
];

interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  // If controlled (e.g. by router)
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  // Layout mode
  variant?: "modal" | "page";
}

export default function SettingsPanel({
  isOpen = true,
  onClose,
  activeTab: controlledTab,
  onTabChange,
  variant = "modal"
}: SettingsPanelProps) {
  const { resetToDefaults } = useSettings();
  const { logout } = useAuth();

  // Internal state if not controlled
  const [internalTab, setInternalTab] = React.useState("appearance");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const activeTabId = controlledTab || internalTab;

  const handleTabChange = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalTab(id);
    }
  };

  const ActiveComponent = TABS.find(t => t.id === activeTabId)?.component || AppearanceTab;

  // Handle ESC key for modal
  React.useEffect(() => {
    if (variant === "modal" && isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape" && onClose) onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [variant, isOpen, onClose]);

  if (!isOpen) return null;

  // ---------------- Render Helpers ----------------

  const Sidebar = () => (
    <div className={`
      flex-shrink-0 border-r border-border bg-[var(--surface)]/50
      ${variant === "modal" ? "w-48 lg:w-60" : "w-full md:w-64"}
    `}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex-grow space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20"
                    : "text-[var(--text)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                  }
                `}
              >
                <span className={`transition-colors ${isActive ? "text-white" : "text-[var(--muted)] group-hover:text-[var(--accent)]"}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOutIcon size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[var(--surface)]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">Settings</h2>
          <p className="text-xs text-[var(--muted)]">Manage your preferences</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.confirm("Reset all settings to default values?")) {
              resetToDefaults();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface)] rounded-md transition-colors"
        >
          <ResetIcon size={14} />
          Reset Defaults
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="btn-close"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const Content = () => (
    <div className="flex-1 bg-[var(--bg)] overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {TABS.find(t => t.id === activeTabId)?.label}
          </h3>
          <p className="text-[var(--muted)] mt-1">
            Customize your {activeTabId} preferences
          </p>
        </div>

        {/* We use .surface class here for the content card, ensuring consistent theming */}
        <div className="surface p-6 shadow-sm">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );

  // ---------------- Layout Variations ----------------

  if (variant === "page") {
    return (
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-[var(--bg)]">
        <Sidebar />
        <Content />
      </div>
    );
  }

  // Modal variant (default)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
    >
      <div
        className="w-full max-w-5xl h-[85vh] surface overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Content />
        </div>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
      />
    </div>
  );
}
