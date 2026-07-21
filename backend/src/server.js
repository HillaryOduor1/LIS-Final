import './monitoring/tracing.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { getMasterConnection } from './config/database.js';
import { emailWorker } from './infrastructure/queue/queue.consumer.js';
import { redisClient, bullRedisClient } from './config/redis.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import * as oauthController from './api/v1/controllers/oauth.controller.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import { getRateLimitModel } from './database/models/rateLimit.model.js';
import { createRateLimiters } from './middleware/rateLimit.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    // Connect to master database (must happen before rate limiters)
    const masterConn = await getMasterConnection();
    logger.info('Connected to master database');

    // Register RateLimit model on master connection
    const RateLimitModel = getRateLimitModel(masterConn);
    await RateLimitModel.init(); // ensure indexes are created
    logger.info('RateLimit model initialized');

    // Create rate limiters with the model
    const rateLimiters = createRateLimiters(RateLimitModel);

    // Redis connections (if used)
    await redisClient.ping();
    await bullRedisClient.ping();
    logger.info('Redis connections ready');

    // Create Express app with rate limiters injected
    const app = createApp(rateLimiters);

    // Backward compatibility OAuth routes (commented out)
    //app.get('/api/auth/google', tenantMiddleware, oauthController.googleAuth);
    //app.get('/api/auth/google/callback', oauthController.googleCallback);
    //app.get('/api/auth/master/google', oauthController.masterGoogleAuth);
    //app.get('/api/auth/master/google/callback', oauthController.masterGoogleCallback);

    const adminBuildPath = path.resolve(__dirname, '../dist/admin');
    const fs = await import('fs');
    if (fs.existsSync(adminBuildPath)) {
      app.use(express.static(adminBuildPath));
      app.get('/', (req, res) => res.sendFile(path.join(adminBuildPath, 'index.html')));
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      logger.info('✅ Admin dashboard static files mounted');
    } else {
      logger.warn('Admin dashboard not found – run "npm run build-admin" first');
    }

    app.use(notFoundHandler);

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        if (emailWorker) await emailWorker.close();
        await redisClient.quit();
        await bullRedisClient.quit();
        await mongoose.disconnect();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
/*
import './monitoring/tracing.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { getMasterConnection } from './config/database.js';
import { emailWorker } from './infrastructure/queue/queue.consumer.js';
import { redisClient, bullRedisClient } from './config/redis.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import * as oauthController from './api/v1/controllers/oauth.controller.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await getMasterConnection();
    logger.info('Connected to master database');

    await redisClient.ping();
    await bullRedisClient.ping();
    logger.info('Redis connections ready');

    const app = createApp();

    // Backward compatibility OAuth routes
    //app.get('/api/auth/google', tenantMiddleware, oauthController.googleAuth);
    //app.get('/api/auth/google/callback', oauthController.googleCallback);
    //app.get('/api/auth/master/google', oauthController.masterGoogleAuth);
    //app.get('/api/auth/master/google/callback', oauthController.masterGoogleCallback);

    const adminBuildPath = path.resolve(__dirname, '../dist/admin');
    const fs = await import('fs');
    if (fs.existsSync(adminBuildPath)) {
      app.use(express.static(adminBuildPath));
      app.get('/', (req, res) => res.sendFile(path.join(adminBuildPath, 'index.html')));
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      logger.info('✅ Admin dashboard static files mounted');
    } else {
      logger.warn('Admin dashboard not found – run "npm run build-admin" first');
    }

    app.use(notFoundHandler);

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        if (emailWorker) await emailWorker.close();
        await redisClient.quit();
        await bullRedisClient.quit();
        await mongoose.disconnect();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();*/

/*import './monitoring/tracing.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { getMasterConnection } from './config/database.js';
import { emailWorker } from './infrastructure/queue/queue.consumer.js';
import { redisClient, bullRedisClient } from './config/redis.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';

import * as oauthController from './api/v1/controllers/oauth.controller.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    // 1. Connect to master database
    await getMasterConnection();
    logger.info('Connected to master database');

    // 2. Verify Redis connections
    await redisClient.ping();
    await bullRedisClient.ping();
    logger.info('Redis connections ready');

    // 3. Create Express app (API only)
    const app = createApp();

    // Tenant OAuth
app.get('/api/auth/google', tenantMiddleware, oauthController.googleAuth);
app.get('/api/auth/google/callback', oauthController.googleCallback);

// Master OAuth
app.get('/api/auth/master/google', oauthController.masterGoogleAuth);
app.get('/api/auth/master/google/callback', oauthController.masterGoogleCallback);

    // 4. Serve admin dashboard static files
    const adminBuildPath = path.resolve(__dirname, '../dist/admin');
    const fs = await import('fs');
    logger.info(`Admin build path: ${adminBuildPath}`);
    
    if (fs.existsSync(adminBuildPath)) {
      // Serve static assets (CSS, JS, images)
      app.use(express.static(adminBuildPath));
      
      // Explicit route for root to serve index.html
      app.get('/', (req, res) => {
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      
      // SPA fallback: any non-API, non-file request -> index.html
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next(); // skip files with extensions
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      
      logger.info('✅ Admin dashboard static files mounted');
    } else {
      logger.warn(`⚠️ Admin dashboard not found at ${adminBuildPath} – run "npm run build-admin" first`);
    }

    // 5. 404 handler for unmatched routes (including API routes not caught)
    app.use(notFoundHandler);

    // 6. Start the server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`📦 Admin dashboard available at http://localhost:${config.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        if (emailWorker) await emailWorker.close();
        await redisClient.quit();
        await bullRedisClient.quit();
        process.exit(0);
      });
      await mongoose.disconnect();
await redisClient.quit();
await bullRedisClient.quit();
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();*/
/*
import './src/monitoring/tracing.js'; // MUST be first
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './src/app.js';
import { config } from './src/config/env.js';
import { logger } from './src/config/logger.js';
import { getMasterConnection } from './src/config/database.js';
import { emailWorker } from './src/infrastructure/queue/queue.consumer.js';
import { redisClient, bullRedisClient } from './src/config/redis.js';


const startServer = async () => {
  try {
    // 1. Connect to master database and wait for it to be ready
    await getMasterConnection();
    logger.info('Connected to master database');

    // 2. Verify Redis connections (optional, but good)
    await redisClient.ping();
    await bullRedisClient.ping();
    logger.info('Redis connections ready');

    // 3. Create Express app
    const app = createApp();

    // 4. Serve admin dashboard static files (if built)
    const fs = await import('fs');
    const path = await import('path');
    const adminBuildPath = path.join(process.cwd(), 'dist', 'admin');
    if (fs.existsSync(adminBuildPath)) {
      app.use(express.static(adminBuildPath));
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      logger.info('Admin dashboard static files mounted');
    } else {
      logger.warn('Admin dashboard not found – skipping static serving');
    }

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await emailWorker.close();
        await redisClient.quit();
        await bullRedisClient.quit();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();*/
/*
import './src/monitoring/tracing.js'; // MUST be first
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './src/app.js';
import { config } from './src/config/env.js';
import { logger } from './src/config/logger.js';
import { getMasterConnection } from './src/config/database.js';
import { emailWorker } from './src/infrastructure/queue/queue.consumer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
mongoose.set('bufferTimeoutMS', 30000); // 30 seconds
const startServer = async () => {
  try {
    // Connect to master database
    await getMasterConnection();
    logger.info('Connected to master database');

    const app = createApp();

    // ========== Serve admin SPA for all non-API routes ==========
    const adminBuildPath = path.join(__dirname, '../dist/admin');
    // Check if admin build exists (optional – fail gracefully)
    const fs = await import('fs');
    if (fs.existsSync(adminBuildPath)) {
      app.use(express.static(adminBuildPath)); // static assets
      // SPA fallback: any non-API, non-file request -> index.html
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      logger.info('Admin dashboard static files mounted');
    } else {
      logger.warn('Admin dashboard not found – skipping static serving');
    }
    // ============================================================

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`📦 Admin dashboard available at http://localhost:${config.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await emailWorker.close();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
  
};

startServer();*/
/*last stable version
require('../telemetry')// MUST be first
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
    /*app.use(cors({
      origin: ['http://localhost:5000','https://lis-backend-cpbe.onrender.com','https://landscapes-integrity-solutions-1phoyv8fe.vercel.app', 'http://localhost:3000','http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
      credentials: true
    }));/

    const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://lis-backend-cpbe.onrender.com",
  "https://landscapes-integrity-solutions.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin(origin, callback) {
    // allow server-to-server or curl requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
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
  });*/

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
