const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, role, tenantId? }

    // Superadmin can work without tenant context
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Normal users need tenant context
    if (!req.tenant && !req.user.tenantId) {
      return res.status(401).json({ message: "Tenant context missing" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

module.exports = { protect, authorize };
/*const jwt = require("jsonwebtoken");
/*
const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};
*/
/*
const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // contains { id, role, tenantId? }

    // If user is superadmin, we may not have a tenant attached yet
    if (req.user.role === 'superadmin') {
      // Allow access without tenant middleware
      return next();
    }

    // For normal users, ensure tenant is present (set by tenantMiddleware)
    if (!req.tenant && !req.user.tenantId) {
      return res.status(401).json({ message: "Tenant context missing" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = { protect, authorize };*/

/*const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};

module.exports = { protect, authorize };*/
/*const jwt = require("jsonwebtoken");

// Protect route - check for token
const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains id, username, role
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Authorize based on roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};

module.exports = { protect, authorize };*/

/*const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  return res.status(401).json({ message: 'No token' });
};

// ✅ ADD THIS
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { protect, authorize };*/


/*const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  return res.status(401).json({ message: 'No token' });
};

module.exports = protect;
/*module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // later: verify JWT
  next();
};*/