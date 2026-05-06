import React, { useState } from 'react';
import {
    LayoutDashboard, FileText, Settings, Users, Activity, MessageSquare,
    LogOut, Sun, Moon, ChevronLeft, ChevronRight,
    X
} from 'lucide-react';

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'contact-messages', label: 'Contact Messages', icon: MessageSquare },
];

export default function Sidebar({ 
    activeTab, 
    setActiveTab, 
    onLogout, 
    theme, 
    toggleTheme, 
    isMobileOpen, 
    setMobileOpen,
    isCollapsed,
    setIsCollapsed 
}) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar - directly attached to left edge */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 h-full z-50
                    bg-white dark:bg-gray-900
                    border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo - compact */}
                <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <span className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                                    Admin CMS
                                </span>
                                <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft size={16} className="text-gray-500" />
                                </button>
                            </>
                        )}
                        {isCollapsed && (
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
                            >
                                <ChevronRight size={16} className="text-gray-500" />
                            </button>
                        )}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation - compact spacing */}
                <nav className="p-2 space-y-0.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg
                                    transition-all duration-200
                                    ${isCollapsed ? 'justify-center' : ''}
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer - compact */}
                <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={toggleTheme}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg
                            text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
                            transition-all mb-1
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        {!isCollapsed && (
                            <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
                        )}
                    </button>

                    <button
                        onClick={onLogout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg
                            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                            transition-all
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && (
                            <span className="text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
/*import React, { } from 'react';
import {
    Home, Settings, Layout, Users, LogOut,
    Sun, Moon, ChevronRight, FileText, Bell,
    X, Activity, BarChart2
} from 'lucide-react';

var menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity Log', icon: Activity },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, theme, toggleTheme, isMobileOpen, setMobileOpen }) {
    return (
        <>
            {/* Mobile overlay /}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={function () { setMobileOpen(false); }}
                    aria-label="Close sidebar overlay"
                />
            )}

            {/* Sidebar /}
            <aside
                className={[
                    'fixed top-0 left-0 h-full z-50 flex flex-col',
                    'bg-background border-r border-border sidebar-transition',
                    'lg:translate-x-0',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                ].join(' ')}
                style={{ width: '260px' }}
            >
                {/* Logo /}
                <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
                            style={{ background: 'var(--accent)' }}
                        >
                            A
                        </div>
                        <span className="font-bold text-lg text-foreground tracking-tight">Admin CMS</span>
                    </div>
                    <button
                        className="lg:hidden p-1.5 rounded-lg text-muted hover:bg-surface"
                        onClick={function () { setMobileOpen(false); }}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation /}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {menuItems.map(function (item) {
                        var Icon = item.icon;
                        var isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={function () {
                                    setActiveTab(item.id);
                                    setMobileOpen(false);
                                }}
                                className={[
                                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
                                    isActive
                                        ? 'text-white shadow-sm'
                                        : 'text-muted hover:text-foreground hover:bg-surface',
                                ].join(' ')}
                                style={isActive ? { background: 'var(--accent)' } : {}}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={17} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={14} />}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer /}
                <div className="p-3 border-t border-border space-y-0.5 flex-shrink-0">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-foreground rounded-xl transition-all"
                    >
                        {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}*/

