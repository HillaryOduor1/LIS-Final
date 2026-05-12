import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Simple Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // --- sanitisation functions ---
    const sanitizeUsername = (input) => {
        return input.trim().replace(/[<>]/g, '');
    };

    const validateUsername = (user) => {
        const trimmed = user.trim();
        return trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_]+$/.test(trimmed);
    };

    const validatePassword = (pass) => {
        return pass.length >= 6;
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Password reset flow
        if (isReset) {
            const safeEmail = resetEmail.trim().toLowerCase();
            if (!validateEmail(safeEmail)) {
                setError('Please enter a valid email address');
                return;
            }
            alert(`Password reset link sent to "${safeEmail}"`);
            setResetEmail('');
            setIsReset(false);
            return;
        }

        // Login flow
        const safeUsername = sanitizeUsername(username);
        const safePassword = password.trim(); // passwords may contain special chars, keep as-is

        if (!validateUsername(safeUsername)) {
            setError('Username must be 3-20 alphanumeric characters (underscore allowed)');
            return;
        }
        if (!validatePassword(safePassword)) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Rate limiting (client side)
        if (attempts >= 5) {
            setError('Too many failed attempts. Please wait 5 minutes.');
            setTimeout(() => setAttempts(0), 300000);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: safeUsername, password: safePassword })
            });

            const data = await res.json();

            if (!res.ok) {
                setAttempts(prev => prev + 1);
                setError(data.error || data.message || 'Invalid credentials');
                return;
            }

            // Verify session
            const meRes = await fetch('/api/auth/me', { credentials: 'include' });
            if (!meRes.ok) {
                setError('Authentication failed. Please try again.');
                return;
            }

            navigate('/dashboard');

        } catch (err) {
            setError(err?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const tenantParam = new URLSearchParams(window.location.search).get('tenant');
        window.location.href = `/api/auth/google?tenant=${tenantParam || ''}`;
    };

    const handleMasterGoogleLogin = () => {
        window.location.href = '/api/auth/master/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950">
            <div className="w-full max-w-md">
                {/* Logo + Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500 shadow-lg mb-4">
                        <LogIn size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isReset ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isReset 
                            ? 'Enter your email to receive a reset link' 
                            : 'Sign in to access the admin dashboard'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isReset ? (
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => { setUsername(e.target.value); setError(''); setAttempts(0); }}
                                            placeholder="admin"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : (isReset ? 'Send Reset Link' : 'Sign In')}
                        </button>
                    </form>

                    {!isReset && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-4 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                            <button
                                onClick={handleMasterGoogleLogin}
                                className="mt-2 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon /> Master Login
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsReset(!isReset); setError(''); setResetEmail(''); }}
                            className="text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
                        >
                            {isReset ? 'Back to Login' : 'Forgot Password?'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
/*import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Simple Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function Login() {
    const navigate = useNavigate(); // ✅ ADD THIS

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isReset) {
            alert('Password reset link sent to "' + resetEmail + '"');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include', // 🔐 important
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            console.log("📡 Login status:", res.status);

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || data.message || 'Login failed');
                return;
            }

            // ✅ VERIFY session before redirect (IMPORTANT FIX)
            const meRes = await fetch('/api/auth/me', {
                credentials: 'include'
            });

            if (!meRes.ok) {
                setError('Authentication failed. Try again.');
                return;
            }

            // ✅ SUCCESS → redirect
            navigate('/dashboard');

        } catch (err) {
            setError(err?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    /*const handleGoogleLogin = () => {
        alert('Google Auth is not configured for this demo.');
    };/
    const handleGoogleLogin = () => {
        // Current tenant identifier – you can get it from URL or env
        const tenantParam = new URLSearchParams(window.location.search).get('tenant');
        window.location.href = `/api/auth/google?tenant=${tenantParam || ''}`;
    };

    // For Master login (optional: separate button)
    const handleMasterGoogleLogin = () => {
        window.location.href = '/api/auth/master/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            <div className="w-full max-w-md">
                {/* Logo + Title /}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg mb-4">
                        <LogIn size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isReset ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isReset 
                            ? 'Enter your email to receive a reset link' 
                            : 'Sign in to access the admin dashboard'}
                    </p>
                </div>

                {/* Login Card /}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isReset ? (
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                            placeholder="admin"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? 'Signing in...' : (isReset ? 'Send Reset Link' : 'Sign In')}
                        </button>
                    </form>

                    {!isReset && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-4 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                            {/* Master Google login /}
                                <button
                                    onClick={handleMasterGoogleLogin}
                                    className="mt-2 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                                >
                                    <GoogleIcon /> Master Login
                                </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsReset(!isReset); setError(''); }}
                            className="text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
                        >
                            {isReset ? 'Back to Login' : 'Forgot Password?'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}*/

/*import * as React from 'react';
import  { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Simple Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    /*const handleSubmit = (e) => {
        e.preventDefault();
        if (isReset) {
            alert('Password reset link sent to "' + resetEmail + '" (Demo)');
            setIsReset(false);
            return;
        }
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };/
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReset) {
        alert('Password reset link sent to "' + resetEmail + '"');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'include', // 🔐 VERY IMPORTANT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        console.log("STATUS:", res.status);

        const data = await res.json();
        console.log("RESPONSE DATA:", data);

        if (!res.ok) {
            //setError(data.message || 'Login failed');
            setError(data.error || data.message || 'Login failed');
            setLoading(false);
            return;
        }

        onLogin();

    } catch (err) {
        setError(err.error || err.message || 'Server error');
        //setError('Server error');
    } finally {
        setLoading(false);
    }
};

    const handleGoogleLogin = () => {
        alert('Google Auth is not configured for this demo.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            <div className="w-full max-w-md">
                {/* Logo + Title /}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg mb-4">
                        <LogIn size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isReset ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isReset 
                            ? 'Enter your email to receive a reset link' 
                            : 'Sign in to access the admin dashboard'}
                    </p>
                </div>

                {/* Login Card /}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isReset ? (
                            /* Reset email field /
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Username field /}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                            placeholder="admin"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password field with eye toggle /}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/*{isReset ? 'Send Reset Link' : 'Sign In'}/}
                            {loading ? 'Signing in...' : (isReset ? 'Send Reset Link' : 'Sign In')}
                        </button>
                    </form>

                    {/* Google sign-in /}
                    {!isReset && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-4 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                        </div>
                    )}

                    {/* Forgot / Back to login /}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsReset(!isReset); setError(''); }}
                            className="text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
                        >
                            {isReset ? 'Back to Login' : 'Forgot Password?'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}*/

/*import React, { useState } from 'react';
import { LogIn, Mail, Lock, RefreshCw, Eye, EyeOff } from 'lucide-react';

// Simple Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function Login({ onLogin }) {
    var [username, setUsername] = useState('');
    var [password, setPassword] = useState('');
    var [showPassword, setShowPassword] = useState(false);
    var [isReset, setIsReset] = useState(false);
    var [error, setError] = useState('');
    var [resetEmail, setResetEmail] = useState('');

    var handleSubmit = function (e) {
        e.preventDefault();
        if (isReset) {
            alert('Password reset link sent to "' + resetEmail + '" (Demo)');
            setIsReset(false);
            return;
        }
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    var handleGoogleLogin = function () {
        alert('Google Auth is not configured for this demo.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
            <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-xl p-8">
                {/* Logo + Title /}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: 'var(--accent)' }}
                    >
                        <LogIn size={24} color="white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isReset ? 'Reset Password' : 'Admin Dashboard'}
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        {isReset ? 'Enter your email to receive a reset link' : 'Welcome back, please sign in'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isReset ? (
                        /* ---- Reset email field ---- /
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={function (e) { setResetEmail(e.target.value); }}
                                    placeholder="admin@example.com"
                                    className="input-base w-full pl-10 pr-4 py-2 rounded-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ---- Username ---- /}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground block">Username</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={function (e) { setUsername(e.target.value); setError(''); }}
                                        placeholder="admin"
                                        className="input-base w-full pl-10 pr-4 py-2 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* ---- Password with eye toggle ---- /}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={function (e) { setPassword(e.target.value); setError(''); }}
                                        placeholder="••••••••"
                                        className="input-base w-full pl-10 pr-10 py-2 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={function () { setShowPassword(!showPassword); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style={{ background: 'var(--accent)' }}
                    >
                        {isReset ? <RefreshCw size={18} /> : <LogIn size={18} />}
                        {isReset ? 'Send Reset Link' : 'Sign In'}
                    </button>
                </form>

                {/* Google sign-in /}
                {!isReset && (
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-2.5 bg-white border border-border text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <GoogleIcon />
                            Google
                        </button>
                    </div>
                )}

                {/* Forgot / Back to login /}
                <div className="mt-6 text-center">
                    <button
                        onClick={function () { setIsReset(!isReset); setError(''); }}
                        className="text-sm font-medium hover:underline"
                        style={{ color: 'var(--accent)' }}
                    >
                        {isReset ? 'Back to Login' : 'Forgot Password?'}
                    </button>
                </div>
            </div>
        </div>
    );
}*/
