require('./telemetry')// MUST be first
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const passport = require('passport');
require('./config/passport')(passport);

const tenantMiddleware = require('./middleware/tenant');
const connectDB = require('./config/db');

const app = express();
app.use(passport.initialize());

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n➡️  ${req.method} ${req.url}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`✅ ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

const BASE_URI = process.env.MONGODB_URI;
if (!BASE_URI) throw new Error("MONGODB_URI missing");

const MAIN_DB_NAME = 'master';
const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);
mongoose.connect(mainURI)
  .then(() => {
    console.log('✅ Connected to MAIN DB (master)');

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: ['http://localhost:5000','https://lis-backend-cpbe.onrender.com','https://landscapes-integrity-solutions-1phoyv8fe.vercel.app', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
      credentials: true
    }));

    // ========== Serve admin SPA for all non-API routes ==========
    const adminBuildPath = path.join(__dirname, 'dist', 'admin');
    app.use(express.static(adminBuildPath));  // static assets
    // SPA fallback: any non-API, non-file request -> index.html
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      if (path.extname(req.path)) return next();
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });
    // ============================================================

    // ========== ROUTES ==========
    // Master & OAuth (without tenant)
    app.use('/api/master', require('./routes/master'));
    app.use('/api/auth', require('./routes/oauth'));

    // Tenant-specific routes (all need tenantMiddleware)
    app.use('/api/auth', tenantMiddleware, require('./routes/auth'));
    app.use('/api/public/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/public/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/public/contact', tenantMiddleware, require('./routes/public/contact'));
    app.use('/api/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/admin', tenantMiddleware, require('./routes/admin'));
    app.use('/api/admin/contact', tenantMiddleware, require('./routes/admin/contact'));
    // After other tenantMiddleware routes, add:
app.use('/api/admin/analytics', tenantMiddleware, require('./routes/admin/analytics'));
app.use('/api/public/analytics', require('./routes/public/analytics')); // public doesn't need tenant

    // 404 for API routes not found
    app.use('/api', (req, res) => {
      console.warn('❌ API route not found:', req.method, req.url);
      res.status(404).json({ error: 'API route not found' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('\n🔥 GLOBAL ERROR', err.stack);
      res.status(500).json({ error: err.message || 'Server Error', path: req.url });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Admin dashboard available at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });
/*const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const passport = require('passport');
require('./config/passport')(passport);

const tenantMiddleware = require('./middleware/tenant');
const connectDB = require('./config/db'); // ensure export exists

const app = express();
app.use(passport.initialize());

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n➡️  ${req.method} ${req.url}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`✅ ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

const BASE_URI = process.env.MONGODB_URI;
if (!BASE_URI) throw new Error("MONGODB_URI missing");

const MAIN_DB_NAME = 'master';
const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);
mongoose.connect(mainURI)
  .then(() => {
    console.log('✅ Connected to MAIN DB (master)');

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: ['http://localhost:5005', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
      credentials: true
    }));

    // Serve admin dashboard
    const adminBuildPath = path.join(__dirname, 'dist', 'admin');
    app.use('/admin', express.static(adminBuildPath));
    app.use('/admin', (req, res, next) => {
      if (path.extname(req.path)) return next();
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });

    // ========== ROUTES ==========
    // 1. Master & OAuth (some without tenant)
    app.use('/api/master', require('./routes/master'));
    app.use('/api/auth', require('./routes/oauth'));   // contains /google, /google/callback, /master/google, /master/google/callback

    // 2. Tenant-specific routes (all need tenantMiddleware)
    app.use('/api/auth', tenantMiddleware, require('./routes/auth')); // local login/logout/me
    app.use('/api/public/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/public/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/public/contact', tenantMiddleware, require('./routes/public/contact'));
    app.use('/api/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/admin', tenantMiddleware, require('./routes/admin'));
    app.use('/api/admin/contact', tenantMiddleware, require('./routes/admin/contact'));

    // 404 for /api
    app.use('/api', (req, res) => {
      console.warn('❌ API route not found:', req.method, req.url);
      res.status(404).json({ error: 'API route not found' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('\n🔥 GLOBAL ERROR', err.stack);
      res.status(500).json({ error: err.message || 'Server Error', path: req.url });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Admin dashboard at http://localhost:${PORT}/admin`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });*/

/*const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');           // 👈 Add this
require('dotenv').config();

const tenantMiddleware = require('./middleware/tenant');

const app = express();
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());

// Helper to insert database name into URI (copied from seed script)
const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

// Global request logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n➡️  ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`✅ ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

const BASE_URI = process.env.MONGODB_URI;
if (!BASE_URI) throw new Error("MONGODB_URI missing");

// Connect to the MASTER database (not the default 'test')
const MAIN_DB_NAME = 'master';
const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);
console.log(`🔌 Connecting to MAIN DB (${MAIN_DB_NAME}) with URI: ${mainURI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);

mongoose.connect(mainURI)
  .then(() => {
    console.log('✅ Connected to MAIN DB (master)');

    app.use(express.json());
    app.use(cookieParser());

    app.use(cors({
      origin: ['http://localhost:5005', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
      credentials: true
    }));

    
    // ========== Serve built admin dashboard (CMS) ==========
const adminBuildPath = path.join(__dirname, 'dist', 'admin');
// Serve static files (JS, CSS, images, etc.)
app.use('/admin', express.static(adminBuildPath));

// SPA fallback: for any request under /admin that isn't a static file, send index.html
app.use('/admin', (req, res, next) => {
    // If the request has a file extension (e.g., .js, .css, .png), skip - let it 404
    if (path.extname(req.path)) {
        return next();
    }
    // Otherwise, serve the admin index.html
    res.sendFile(path.join(adminBuildPath, 'index.html'));
});
// =======================================================
    /* The admin builds into backend/dist/admin
    const adminBuildPath = path.join(__dirname, 'dist', 'admin');
    app.use('/admin', express.static(adminBuildPath));
    
    // Catch-all for admin SPA – any route under /admin/* (except static files) serves index.html
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });*/
    // =======================================================

    // Routes
  /*  app.use('/api/auth', require('./routes/oauth'));
    app.use('/api/master', require('./routes/master'));
    app.use('/api/auth', tenantMiddleware, require('./routes/auth'));  // existing local auth
    app.use('/api/public/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/public/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/public/contact', tenantMiddleware, require('./routes/public/contact'));

    app.use('/api/content', tenantMiddleware, require('./routes/public/content'));
    app.use('/api/settings', tenantMiddleware, require('./routes/public/settings'));
    app.use('/api/auth', tenantMiddleware, require('./routes/auth'));
    app.use('/api/admin', tenantMiddleware, require('./routes/admin'));
    app.use('/api/admin/contact', tenantMiddleware, require('./routes/admin/contact'));

    // 404 handler for unmatched API routes
    app.use('/api', (req, res) => {
      console.warn('❌ API route not found:', req.method, req.url);
      res.status(404).json({ error: 'API route not found' });
    });
    /* 404 handler for API routes only (optional, but keep for clarity)
    app.use('/api/*', (req, res) => {
      console.warn('❌ API route not found:', req.method, req.url);
      res.status(404).json({ error: 'API route not found' });
    });*/

    // Global error handler
    /*app.use((err, req, res, next) => {
      console.error('\n🔥 GLOBAL ERROR');
      console.error('URL:', req.url);
      console.error('METHOD:', req.method);
      console.error('STACK:', err.stack);
      res.status(500).json({ error: err.message || 'Server Error', path: req.url });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Admin dashboard available at http://localhost:${PORT}/admin`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });*/
