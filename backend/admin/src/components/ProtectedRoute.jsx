import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    
    const isMasterRoute = location.pathname.startsWith('/master');

    useEffect(() => {
        const endpoint = isMasterRoute ? '/api/v1/auth/master/me' : '/api/v1/auth/me';
        
        fetch(endpoint, {
            credentials: "include",
            headers: { "Cache-Control": "no-cache" }
        })
        .then(res => {
            if (!res.ok) throw new Error('Not authenticated');
            return res.json();
        })
        .then(data => {
            const userData = data.data || data;
            setUserRole(userData.role?.toLowerCase());
            setIsAuthenticated(true);
            setLoading(false);
        })
        .catch(err => {
            console.error("Auth error:", err);
            setIsAuthenticated(false);
            setLoading(false);
        });
    }, [isMasterRoute]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(userRole)) {
        console.log("Access denied. Role:", userRole, "Required:", roles);
        return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
}
/*import { useEffect, useState, createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Create a context for user data
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export default function ProtectedRoute({ children, roles }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    const isMasterRoute = location.pathname.startsWith('/master');

    useEffect(() => {
        console.log("Checking session...", isMasterRoute ? "(master route)" : "(tenant route)");
        
        const endpoint = isMasterRoute ? '/api/v1/auth/master/me' : '/api/v1/auth/me';
        
        fetch(endpoint, {
            credentials: "include",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        })
        .then(res => {
            console.log(`${endpoint} status:`, res.status);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("User data:", data);
            const userData = data.data || data;
            setUser(userData);
            setLoading(false);
        })
        .catch(err => {
            console.error("Auth error:", err);
            setUser(null);
            setLoading(false);
        });
    }, [isMasterRoute]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!user) {
        console.log("No user → redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        console.log("Role not allowed:", user.role, "Required:", roles);
        return <Navigate to="/unauthorized" replace />;
    }
    
    console.log("Access granted for role:", user.role);
    
    // Provide user data to children via context
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}*/
/*import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    // Check if this is a master route
    const isMasterRoute = location.pathname.startsWith('/master');

    useEffect(() => {
        console.log("Checking session...", isMasterRoute ? "(master route)" : "(tenant route)");
        
        // Use different endpoint for master routes
        const endpoint = isMasterRoute ? '/api/v1/auth/master/me' : '/api/v1/auth/me';
        
        fetch(endpoint, {
            credentials: "include",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        })
        .then(res => {
            console.log(`${endpoint} status:`, res.status);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("User data:", data);
            // Extract user from data.data
            const userData = data.data || data;
            setUser(userData);
            setLoading(false);
        })
        .catch(err => {
            console.error("Auth error:", err);
            setUser(null);
            setLoading(false);
        });
    }, [isMasterRoute]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!user) {
        console.log("No user → redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // Role check
    if (roles && !roles.includes(user.role)) {
        console.log("Role not allowed:", user.role, "Required:", roles);
        return <Navigate to="/unauthorized" replace />;
    }
    
    console.log("Access granted for role:", user.role);
    return children;
} /*


/*import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Checking session...");
        fetch("/api/v1/auth/me", {
            credentials: "include",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        })
        .then(res => {
            console.log("/me status:", res.status);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("/me raw response:", data);
            // Extract user from data.data (the actual user object)
            const userData = data.data || data;
            console.log("User data:", userData);
            setUser(userData);
            setLoading(false);
        })
        .catch(err => {
            console.error("/me error:", err);
            setUser(null);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!user) {
        console.log("No user → redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // Role check
    if (roles && !roles.includes(user.role)) {
        console.log("Role not allowed:", user.role, "Required:", roles);
        return <Navigate to="/unauthorized" replace />;
    }
    
    console.log("Access granted for role:", user.role);
    return children;
}*/

/*import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Checking session...");
        fetch("/api/v1/auth/me", {
            credentials: "include"
        })
        //.then(res => res.json())
        .then(res => {
            console.log("/me status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("/me data:", data);
            setUser(data);
            setLoading(false);
        })
        //.catch(() => setLoading(false));
        .catch(err => {
            console.error("/me error:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;//return <p>Loading...</p>;
    //if (!user) return <Navigate to="/login" />;
    if (!user) {
        console.log("No user → redirecting to login");
        return <Navigate to="/login" />;
    }

    // Role check
    if (roles && !roles.includes(user.role)) {
        console.log("Role not allowed");
        return <Navigate to="/unauthorized" />;
    }
    console.log("Access granted");

    return children;
}*/