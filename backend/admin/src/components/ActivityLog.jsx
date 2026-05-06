/*import React, { useState, useEffect } from 'react';
import {
    Activity, Filter, Search, Settings2, FileText,
    User, LogIn, LogOut, RefreshCw, Trash2, Download
} from 'lucide-react';

var API_BASE = '/api/admin';

var ACTION_ICONS = {
    settings_save: Settings2,
    content_update: FileText,
    user_login: LogIn,
    user_logout: LogOut,
    user_create: User,
    user_delete: Trash2,
    default: Activity,
};

var ACTION_COLORS = {
    settings_save: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    content_update: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    user_login: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    user_logout: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    user_create: 'text-accent bg-accent/10',
    user_delete: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    default: 'text-muted bg-surface',
};

var MOCK_ACTIVITY = [
    { id: 1, action: 'settings_save', label: 'Settings updated', detail: 'Appearance tab — theme changed to dark', user: 'admin', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    { id: 2, action: 'content_update', label: 'Hero section edited', detail: 'Headline and subtext updated', user: 'admin', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 3, action: 'user_login', label: 'Admin logged in', detail: 'via username/password', user: 'admin', timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
    { id: 4, action: 'content_update', label: 'Pricing updated', detail: 'Pro plan price changed to $79/mo', user: 'editor', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 5, action: 'settings_save', label: 'Typography settings saved', detail: 'Font family changed to Inter', user: 'admin', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 6, action: 'user_create', label: 'New user created', detail: 'editor@example.com — role: editor', user: 'admin', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 7, action: 'content_update', label: 'Features section updated', detail: '3 feature cards edited', user: 'editor', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 8, action: 'user_logout', label: 'User logged out', detail: 'Session ended normally', user: 'editor', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

function timeAgo(iso) {
    var diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
}

function formatFull(iso) {
    try {
        return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return iso; }
}

function ActionBadge({ action }) {
    var colorClass = ACTION_COLORS[action] || ACTION_COLORS.default;
    var Icon = ACTION_ICONS[action] || ACTION_ICONS.default;
    return (
        <div className={'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ' + colorClass}>
            <Icon size={16} />
        </div>
    );
}

var ACTION_LABELS = {
    settings_save: 'Settings',
    content_update: 'Content',
    user_login: 'Login',
    user_logout: 'Logout',
    user_create: 'User',
    user_delete: 'Delete',
};

export default function ActivityLog() {
    var [logs, setLogs] = useState(MOCK_ACTIVITY);
    var [loading, setLoading] = useState(false);
    var [search, setSearch] = useState('');
    var [actionFilter, setActionFilter] = useState('all');

    useEffect(function () {
        fetch(API_BASE + '/activity')
            .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
            .then(function (data) { if (Array.isArray(data) && data.length) setLogs(data); })
            .catch(function () { /* use mock / });
    }, []);

    var handleRefresh = function () {
        setLoading(true);
        setTimeout(function () { setLoading(false); }, 800);
    };

    var handleExport = function () {
        var csv = 'Timestamp,User,Action,Detail\n' + logs.map(function (l) {
            return [l.timestamp, l.user, l.label, l.detail].join(',');
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'activity-log-' + Date.now() + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    var handleClear = function () {
        if (window.confirm('Clear all activity logs?')) {
            setLogs([]);
            fetch(API_BASE + '/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([]),
            }).catch(function () { });
        }
    };

    var filtered = logs.filter(function (l) {
        var matchSearch = !search
            || l.label.toLowerCase().includes(search.toLowerCase())
            || l.detail.toLowerCase().includes(search.toLowerCase())
            || l.user.toLowerCase().includes(search.toLowerCase());
        var matchAction = actionFilter === 'all' || l.action === actionFilter;
        return matchSearch && matchAction;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header /}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
                    <p className="text-sm text-muted mt-0.5">Track all admin actions and system events</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:bg-surface transition-all"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:bg-surface transition-all"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-all"
                    >
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>
            </div>

            {/* Stats /}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Events', value: logs.length },
                    { label: 'Today', value: logs.filter(function (l) { return new Date(l.timestamp).toDateString() === new Date().toDateString(); }).length },
                    { label: 'Content Changes', value: logs.filter(function (l) { return l.action === 'content_update'; }).length },
                    { label: 'Settings Saves', value: logs.filter(function (l) { return l.action === 'settings_save'; }).length },
                ].map(function (s, i) {
                    return (
                        <div key={i} className="card p-4 text-center">
                            <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                            <div className="text-xs text-muted mt-0.5">{s.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters /}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={function (e) { setSearch(e.target.value); }}
                        placeholder="Search events..."
                        className="input-base w-full pl-9 pr-4 py-2 text-sm rounded-lg"
                    />
                </div>
                <select
                    value={actionFilter}
                    onChange={function (e) { setActionFilter(e.target.value); }}
                    className="input-base px-3 py-2 text-sm rounded-lg cursor-pointer"
                >
                    <option value="all">All Actions</option>
                    <option value="settings_save">Settings</option>
                    <option value="content_update">Content</option>
                    <option value="user_login">Logins</option>
                    <option value="user_create">User Created</option>
                    <option value="user_delete">User Deleted</option>
                </select>
            </div>

            {/* Log list /}
            <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Activity size={36} className="mx-auto mb-3 opacity-20 text-muted" />
                        <p className="text-muted text-sm">No activity found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filtered.map(function (log) {
                            return (
                                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-surface/50 transition-colors">
                                    <ActionBadge action={log.action} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-sm text-foreground">{log.label}</span>
                                            <span className="text-xs font-medium text-muted bg-surface px-2 py-0.5 rounded-full">{log.user}</span>
                                        </div>
                                        <p className="text-xs text-muted truncate">{log.detail}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-xs text-muted" title={formatFull(log.timestamp)}>{timeAgo(log.timestamp)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}*/
// src/components/ActivityLog.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Search, RefreshCw, Trash2, Download } from 'lucide-react';

const API_BASE = '/api/admin';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  /*const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };*/
  const fetchLogs = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/activity`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    // If the API returns an object with a 'logs' array, extract it
    const logsArray = Array.isArray(data) ? data : (data.logs || []);
    setLogs(logsArray);
  } catch (err) {
    console.error('Failed to load activity logs');
    setLogs([]);  // ensure it's an array even on error
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClear = async () => {
    if (!window.confirm('Delete all activity logs? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/activity/clear`, { method: 'DELETE' });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error('Clear failed');
    }
  };

  const handleExport = () => {
    const filtered = logs.filter(log => {
      const matchSearch = !search || log.label?.toLowerCase().includes(search.toLowerCase()) || log.user?.toLowerCase().includes(search.toLowerCase());
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      return matchSearch && matchAction;
    });
    const csv = ['Timestamp,User,Action,Label,Detail', ...filtered.map(l => `${l.timestamp},${l.user},${l.action},${l.label},${l.detail || ''}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = logs.filter(log => {
    const matchSearch = !search || log.label?.toLowerCase().includes(search.toLowerCase()) || log.user?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-sm text-muted">Track admin actions and system events</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLogs} className="p-2 rounded-lg border hover:bg-surface"><RefreshCw size={16} /></button>
          <button onClick={handleExport} className="p-2 rounded-lg border hover:bg-surface"><Download size={16} /></button>
          <button onClick={handleClear} className="p-2 rounded-lg border text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="input-base w-full pl-9 py-2 rounded-lg" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="input-base rounded-lg px-3">
          <option value="all">All Actions</option>
          <option value="settings_save">Settings</option>
          <option value="content_update">Content</option>
          <option value="user_login">Login</option>
          <option value="user_create">User Created</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">No activity found</div>
      ) : (
        <div className="divide-y border rounded-xl overflow-hidden">
          {filtered.map(log => (
            <div key={log._id} className="flex items-start gap-4 p-4 hover:bg-surface/50">
              <div className="w-2 h-2 mt-2 rounded-full bg-accent"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{log.label}</span>
                  <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full">{log.user}</span>
                </div>
                {log.detail && <p className="text-xs text-muted mt-1">{log.detail}</p>}
              </div>
              <div className="text-xs text-muted whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
