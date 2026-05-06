import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 Checking session...");
        fetch("/api/auth/me", {
            credentials: "include"
        })
        //.then(res => res.json())
        .then(res => {
            console.log("📡 /me status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("👤 /me data:", data);
            setUser(data);
            setLoading(false);
        })
        //.catch(() => setLoading(false));
        .catch(err => {
            console.error("❌ /me error:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    //if (!user) return <Navigate to="/login" />;
    if (!user) {
        console.log("⛔ No user → redirecting to login");
        return <Navigate to="/login" />;
    }

    // 🔥 Role check
    if (roles && !roles.includes(user.role)) {
        console.log("⛔ Role not allowed");
        return <Navigate to="/unauthorized" />;
    }
    console.log("✅ Access granted");

    return children;
}