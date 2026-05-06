import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Activity, LogOut, Search, Bell, MessageSquare,BarChart } from 'lucide-react';
import { ThemeToggle } from './themeToggle';

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
];

export default function Navbar({ activeTab, setActiveTab, onLogout, showBackToMaster, onBackToMaster }) {
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
            <div className="px-4 lg:px-6">
                {/* Top row with logo and user actions */}
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
                                Admin CMS
                            </span>
                        </div>
                    </div>

                    {/* Right section - Search, Notifications, User */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                            />
                        </div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Back to Master button – only appears when coming from master */}
                        {showBackToMaster && (
                            <button
                                onClick={onBackToMaster}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-all"
                                title="Return to Master Dashboard"
                            >
                                ← Back to Master
                            </button>
                        )}

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                        </button>

                        {/* User Avatar */}
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-medium">AD</span>
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
                            title="Logout"
                        >
                            <LogOut size={18} className="text-red-500 dark:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                    transition-all duration-200 border-b-2 whitespace-nowrap
                                    ${isActive 
                                        ? 'border-accent-500 text-accent-600 dark:text-accent-400' 
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
/*import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Activity, LogOut, Sun, Moon, Search, Bell } from 'lucide-react';

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
];

export default function Navbar({ activeTab, setActiveTab, onLogout, theme, toggleTheme }) {
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
            <div className="px-4 lg:px-6">
                {/* Top row with logo and user actions /}
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
                                Admin CMS
                            </span>
                        </div>
                    </div>

                    {/* Right section - Search, Notifications, User /}
                    <div className="flex items-center gap-2">
                        {/* Search /}
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                            />
                        </div>

                        {/* Theme Toggle /}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'light' ? <Moon size={18} className="text-gray-600 dark:text-gray-400" /> : <Sun size={18} className="text-gray-400" />}
                        </button>

                        {/* Notifications /}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                        </button>

                        {/* User Avatar /}
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-medium">AD</span>
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                        </div>

                        {/* Logout /}
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
                            title="Logout"
                        >
                            <LogOut size={18} className="text-red-500 dark:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs /}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                    transition-all duration-200 border-b-2 whitespace-nowrap
                                    ${isActive 
                                        ? 'border-accent-500 text-accent-600 dark:text-accent-400' 
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}*/
/*import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Activity, LogOut, Sun, Moon, Search, Bell } from 'lucide-react';

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
];

export default function Navbar({ activeTab, setActiveTab, onLogout, theme, toggleTheme }) {
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
            <div className="px-4 lg:px-6">
                {/* Top row with logo and user actions /}
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
                                Admin CMS
                            </span>
                        </div>
                    </div>

                    {/* Right section - Search, Notifications, User /}
                    <div className="flex items-center gap-2">
                        {/* Search /}
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500"
                            />
                        </div>

                        {/* Theme Toggle /}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'light' ? <Moon size={18} className="text-gray-600" /> : <Sun size={18} className="text-gray-400" />}
                        </button>

                        {/* Notifications /}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* User Avatar /}
                        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">AD</span>
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                        </button>

                        {/* Logout /}
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
                        >
                            <LogOut size={18} className="text-red-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs /}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                    transition-all duration-200 border-b-2 whitespace-nowrap
                                    ${isActive 
                                        ? 'border-accent-500 text-accent-600 dark:text-accent-400' 
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}*/