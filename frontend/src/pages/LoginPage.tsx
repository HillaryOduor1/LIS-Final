import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "forgot" | "reset";

const LoginPage: React.FC = () => {
    const [mode, setMode] = React.useState<AuthMode>("login");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const { login, loginWithGoogle, forgotPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (mode === "login") {
            if (login(username, password)) {
                navigate(from, { replace: true });
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } else if (mode === "forgot") {
            if (forgotPassword(email)) {
                setSuccess("Password reset email sent! Please check your inbox.");
                setTimeout(() => setMode("login"), 3000);
            }
        }
    };

    const handleGoogleLogin = () => {
        if (loginWithGoogle()) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-[var(--bg)] text-[var(--text)] px-4">
            <div className="w-full max-w-md p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl transition-all">
                <div className="flex flex-col items-center gap-6">
                    <div className="size-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[var(--accent)]/20">
                        A
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mode === "login" ? "Admin Access" : mode === "forgot" ? "Reset Password" : "New Password"}
                        </h1>
                        <p className="text-[var(--muted)] mt-1">
                            {mode === "login"
                                ? "Please enter your credentials to continue"
                                : "Enter your email to receive a reset link"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        {mode === "login" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium opacity-70">Username</label>
                                    <input
                                        type="text"
                                        placeholder="admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium opacity-70">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setMode("forgot")}
                                            className="text-xs text-[var(--accent)] hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {mode === "forgot" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium opacity-70">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    required
                                />
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-1">{success}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:filter hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent)]/20"
                        >
                            {mode === "login" ? "Log In" : "Send Reset Link"}
                        </button>

                        {mode !== "login" && (
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="w-full text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                            >
                                Back to Login
                            </button>
                        )}
                    </form>

                    {mode === "login" && (
                        <div className="w-full space-y-4">
                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-[var(--border)]"></div>
                                <span className="flex-shrink mx-4 text-xs text-[var(--muted)] uppercase tracking-widest">or</span>
                                <div className="flex-grow border-t border-[var(--border)]"></div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black border border-gray-300 font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.67-.35-1.39-.35-2.1s.13-1.43.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-[var(--muted)] opacity-50 uppercase tracking-widest">
                        secure system access
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
