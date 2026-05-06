import React, { useState, useEffect } from 'react'; // ✅ added useEffect
import Navbar from './Navbar';
import Overview from './Overview';
import ContentManager from './ContentManager';
import Settings from './Settings';
import UsersManager from './Users';
import ActivityLog from './ActivityLog';
import ContactMessages from './ContactMessage'
import { Menu } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import AnalyticsDashboard from './AnalyticsDashboard/AnalyticsDashboard';
import { useLocation } from 'react-router-dom';


const tabComponents = {
    overview: Overview,
    content: ContentManager,
    settings: Settings,
    users: UsersManager,
    analytics: AnalyticsDashboard,
    activity: ActivityLog,
    messages: ContactMessages,
};

const tabTitles = {
    overview: 'Dashboard',
    content: 'Content Manager',
    settings: 'Settings',
    users: 'Users',
    analytics: 'Analytics',
    activity: 'Activity Log',
    messages: 'Messages',
};

// Helper to read a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const handleLogout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
        console.error('Logout failed', err);
    } finally {
        window.location.href = '/login';
    }
};

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBackToMaster, setShowBackToMaster] = useState(false);

    useEffect(() => {
        const fromMaster = getCookie('switched_from_master') === 'true';
        setShowBackToMaster(fromMaster);
    }, []);

    const handleBackToMaster = async () => {
        try {
            const res = await fetch('/api/auth/switch-to-master', {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                window.location.href = '/master/tenants';
            } else {
                alert('Unable to return to master dashboard');
            }
        } catch (err) {
            console.error(err);
            alert('Error returning to master');
        }
    };

    const navigate = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const ActiveComponent = tabComponents[activeTab];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar - only on mobile */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 z-50
                    bg-white dark:bg-gray-900
                    shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Admin CMS
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="p-3 space-y-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: '📊' },
                        { id: 'content', label: 'Content', icon: '📄' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' },
                        { id: 'users', label: 'Users', icon: '👥' },
                        { id: 'activity', label: 'Activity', icon: '📋' },
                        { id: 'messages', label: 'Messages', icon: '✉️' },
                        { id: 'analytics', label: 'Analytics', icon: '📈' },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    transition-all duration-200 text-left
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400">
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen">
                {/* Mobile Menu Button - only visible on mobile */}
                <div className="lg:hidden fixed top-4 left-4 z-20">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800"
                    >
                        <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navbar - now receives props */}
                <Navbar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={handleLogout}
                    showBackToMaster={showBackToMaster}
                    onBackToMaster={handleBackToMaster}
                />

                {/* Page Title - Mobile */}
                <div className="lg:hidden px-4 pt-4 pb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tabTitles[activeTab]}
                    </h1>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        <ActiveComponent 
                            navigate={navigate} 
                            searchQuery={searchQuery}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
/*import React, { useState } from 'react';
import Navbar from './Navbar';
import Overview from './Overview';
import ContentManager from './ContentManager';
import Settings from './Settings';
import UsersManager from './Users';
import ActivityLog from './ActivityLog';
import { Menu } from 'lucide-react';

const tabComponents = {
    overview: Overview,
    content: ContentManager,
    settings: Settings,
    users: UsersManager,
    activity: ActivityLog,
};

const tabTitles = {
    overview: 'Dashboard',
    content: 'Content Manager',
    settings: 'Settings',
    users: 'Users',
    activity: 'Activity Log',
};

export default function Dashboard({ onLogout, theme, toggleTheme, accentColor }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const ActiveComponent = tabComponents[activeTab];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Menu Overlay /}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar - only on mobile /}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 z-50
                    bg-white dark:bg-gray-900
                    shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Admin CMS
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="p-3 space-y-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: '📊' },
                        { id: 'content', label: 'Content', icon: '📄' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' },
                        { id: 'users', label: 'Users', icon: '👥' },
                        { id: 'activity', label: 'Activity', icon: '📋' },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    transition-all duration-200 text-left
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
                        <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content /}
            <div className="flex flex-col min-h-screen">
                {/* Mobile Menu Button - only visible on mobile /}
                <div className="lg:hidden fixed top-4 left-4 z-20">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800"
                    >
                        <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navbar - visible on all devices /}
                <Navbar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={onLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                {/* Page Title - Mobile /}
                <div className="lg:hidden px-4 pt-4 pb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tabTitles[activeTab]}
                    </h1>
                </div>

                {/* Main Content Area /}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        <ActiveComponent 
                            navigate={navigate} 
                            searchQuery={searchQuery}
                            theme={theme}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}*/


/*import React, { useState } from 'react';
import Navbar from './Navbar';
import Overview from './Overview';
import ContentManager from './ContentManager';
import Settings from './Settings';
import UsersManager from './Users';
import ActivityLog from './ActivityLog';
import { Menu } from 'lucide-react';

const tabComponents = {
    overview: Overview,
    content: ContentManager,
    settings: Settings,
    users: UsersManager,
    activity: ActivityLog,
};

const tabTitles = {
    overview: 'Dashboard',
    content: 'Content Manager',
    settings: 'Settings',
    users: 'Users',
    activity: 'Activity Log',
};

export default function Dashboard({ onLogout, theme, toggleTheme, accentColor }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const ActiveComponent = tabComponents[activeTab];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Menu Overlay /}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar - only on mobile /}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 z-50
                    bg-white dark:bg-gray-900
                    shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Admin CMS
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={18} className="text-gray-500" />
                    </button>
                </div>

                <nav className="p-3 space-y-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: '📊' },
                        { id: 'content', label: 'Content', icon: '📄' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' },
                        { id: 'users', label: 'Users', icon: '👥' },
                        { id: 'activity', label: 'Activity', icon: '📋' },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    transition-all duration-200 text-left
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
                        <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content /}
            <div className="flex flex-col min-h-screen">
                {/* Mobile Menu Button - only visible on mobile /}
                <div className="lg:hidden fixed top-4 left-4 z-20">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800"
                    >
                        <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navbar - visible on all devices /}
                <Navbar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={onLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                {/* Page Title - Mobile /}
                <div className="lg:hidden px-4 pt-4 pb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tabTitles[activeTab]}
                    </h1>
                </div>

                {/* Main Content Area /}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        <ActiveComponent 
                            navigate={navigate} 
                            searchQuery={searchQuery}
                            theme={theme}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}*/


/*import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import ContentManager from './ContentManager';
import Settings from './Settings';
import UsersManager from './Users';
import ActivityLog from './ActivityLog';
import { Menu, Bell } from 'lucide-react';

var tabTitles = {
    overview: 'Dashboard Overview',
    content: 'Content Manager',
    settings: 'Settings',
    users: 'Users',
    activity: 'Activity Log',
};

function Topbar({ onMenuClick, title, accentColor }) {
    return (
        <header
            className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background sticky top-0 z-30"
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-muted hover:bg-surface transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-base font-bold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="p-2 rounded-lg text-muted hover:bg-surface transition-colors"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                </button>
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: accentColor || 'var(--accent)' }}
                >
                    A
                </div>
            </div>
        </header>
    );
}

export default function Dashboard({ onLogout, theme, toggleTheme, accentColor }) {
    var [activeTab, setActiveTab] = useState('overview');
    var [isMobileOpen, setMobileOpen] = useState(false);

    var navigate = function (tab) {
        setActiveTab(tab);
        setMobileOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
                theme={theme}
                toggleTheme={toggleTheme}
                isMobileOpen={isMobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main content /}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
                <Topbar
                    onMenuClick={function () { setMobileOpen(true); }}
                    title={tabTitles[activeTab] || 'Admin'}
                    accentColor={accentColor}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {activeTab === 'overview' && <Overview navigate={navigate} />}
                    {activeTab === 'content' && <ContentManager />}
                    {activeTab === 'settings' && <Settings />}
                    {activeTab === 'users' && <UsersManager />}
                    {activeTab === 'activity' && <ActivityLog />}
                </main>
            </div>
        </div>
    );
}*/
