import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestLogger } from './middleware/logging.middleware.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { idempotencyMiddleware } from './middleware/indempotency.middleware.js';
import v1Routes from './api/v1/routes/v1.routes.js';
import { healthController } from './monitoring/health.controller.js';
import { httpRequestDuration, activeConnections, register } from './monitoring/metrics.js';
import passport from './config/passport.js';
import { logger } from './config/logger.js';

// Optional: Payload size monitoring middleware
const payloadMonitor = (req, res, next) => {
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
  });
  req.on('end', () => {
    if (size > 1024 * 1024) { // > 1MB
      logger.warn({
        path: req.path,
        method: req.method,
        size: `${(size / 1024 / 1024).toFixed(2)}MB`,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }, 'Large payload detected');
    }
  });
  next();
};

export const createApp = () => {
  const app = express();

  // Security headers
  securityMiddleware(app);

  // ========== COMPRESSION (Optimized for production) ==========
  // Apply compression before other middleware to compress responses
  app.use(compression({
    // Compression level: 1-9, 6 is optimal for text/JSON (good balance of speed vs compression)
    level: process.env.NODE_ENV === 'production' ? 6 : 1,
    
    // Only compress responses larger than 1KB (skip tiny responses)
    threshold: 1024,
    
    // Custom filter to determine what to compress
    filter: (req, res) => {
      // Don't compress if client explicitly requests no compression
      if (req.headers['x-no-compression']) {
        return false;
      }
      
      // Don't compress already compressed formats
      const contentType = res.getHeader('content-type');
      if (contentType && typeof contentType === 'string') {
        const skipCompression = [
          'image/',      // Images are already compressed
          'video/',      // Videos are already compressed
          'audio/',      // Audio is already compressed
          'application/octet-stream'
        ];
        if (skipCompression.some(type => contentType.includes(type))) {
          return false;
        }
      }
      
      // Use default compression filter for everything else
      return compression.filter(req, res);
    }
  }));

  // ========== BODY PARSER WITH REASONABLE LIMITS ==========
  // 2MB limit is sufficient for JSON content (actual content compresses to <100KB)
  // This prevents DoS attacks while allowing legitimate large content
  app.use(express.json({ 
    limit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb',
    // Optional: Verify payload size before parsing
    verify: (req, res, buf) => {
      // Log payloads approaching the limit for monitoring
      if (buf.length > 1024 * 1024) { // > 1MB
        logger.info({
          path: req.path,
          size: `${(buf.length / 1024 / 1024).toFixed(2)}MB`,
          limit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb'
        }, 'Large JSON payload received');
      }
    }
  }));
  
  app.use(express.urlencoded({ 
    extended: true, 
    limit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb' 
  }));
  
  // Optional: Monitor payload sizes (uncomment if needed)
  // app.use(payloadMonitor);
  
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(passport.initialize());

  // Correlation ID & logging
  app.use(correlationIdMiddleware);
  app.use(requestLogger);

  // Rate limiting (protects against brute force and DoS)
  app.use(globalRateLimiter);

  // Metrics middleware
  app.use((req, res, next) => {
    const start = Date.now();
    activeConnections.inc();
    res.on('finish', () => {
      const duration = Date.now() - start;
      httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
      activeConnections.dec();
    });
    next();
  });

  // Tenant resolution
  app.use(tenantMiddleware);
  
  // Authentication
  app.use(authenticate);
  
  // Idempotency (prevents duplicate requests)
  app.use(idempotencyMiddleware);

  // ========== HEALTH AND MONITORING ENDPOINTS ==========
  app.get('/health', healthController.liveness);
  app.get('/ready', healthController.readiness);
  app.get('/live', healthController.startup);
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // API routes (all v1 endpoints)
  app.use('/api/v1', v1Routes);

  // Global error handler (404 will be added in server.js after static files)
  app.use(errorHandler);

  return app;
};
/*
To Further Optimize (Optional):

If you want to track compression effectiveness, add this middleware:
javascript

// Add after compression middleware to log compression stats
app.use((req, res, next) => {
  const originalJson = res.json;
  let originalSize = 0;
  let compressedSize = 0;
  
  res.json = function(data) {
    originalSize = Buffer.byteLength(JSON.stringify(data));
    originalJson.call(this, data);
    compressedSize = res.getHeader('content-length') || originalSize;
    
    if (originalSize > 1024) { // Only log responses > 1KB
      logger.debug({
        path: req.path,
        original: `${(originalSize / 1024).toFixed(2)}KB`,
        compressed: `${(compressedSize / 1024).toFixed(2)}KB`,
        ratio: `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`
      }, 'Compression stats');
    }
  };
  next();
});

This configuration will eliminate the 413 error while maintaining good security practices for production.

*/



/*last stable version,works but lacks reasonable payload limits and compression
payload import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestLogger } from './middleware/logging.middleware.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { idempotencyMiddleware } from './middleware/indempotency.middleware.js';
import v1Routes from './api/v1/routes/v1.routes.js';
import { healthController } from './monitoring/health.controller.js';
import { httpRequestDuration, activeConnections, register } from './monitoring/metrics.js';
import passport from './config/passport.js';


export const createApp = () => {
  const app = express();

  // Security headers
  securityMiddleware(app);

  // Standard middleware
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(passport.initialize());

  // Correlation ID & logging
  app.use(correlationIdMiddleware);
  app.use(requestLogger);

  // Rate limiting
  app.use(globalRateLimiter);

  // Metrics middleware
  app.use((req, res, next) => {
    const start = Date.now();
    activeConnections.inc();
    res.on('finish', () => {
      const duration = Date.now() - start;
      httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
      activeConnections.dec();
    });
    next();
  });

  // Tenant resolution
  app.use(tenantMiddleware);
  
  // Authentication
  app.use(authenticate);
  
  // Idempotency
  app.use(idempotencyMiddleware);

  // Health endpoints
  app.get('/health', healthController.liveness);
  app.get('/ready', healthController.readiness);
  app.get('/live', healthController.startup);
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // API routes
  app.use('/api/v1', v1Routes);

  // Global error handler (404 will be added in server.js after static files)
  app.use(errorHandler);

  return app;
};*/


/*
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestLogger } from './middleware/logging.middleware.js';
import { globalRateLimiter, authRateLimiter } from './middleware/rateLimit.middleware.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { idempotencyMiddleware } from './middleware/indempotency.middleware.js';
import v1Routes from './api/v1/routes/v1.routes.js';
import { healthController } from './monitoring/health.controller.js';
import { httpRequestDuration, activeConnections, register } from './monitoring/metrics.js';

export const createApp = () => {
  const app = express();

  // Security headers
  securityMiddleware(app);

  // Standard middleware
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(cors(corsOptions));

  // Correlation ID & logging
  app.use(correlationIdMiddleware);
  app.use(requestLogger);

  // Rate limiting (global and auth-specific – apply authLimiter on auth routes)
  app.use(globalRateLimiter);

  // Metrics middleware
  app.use((req, res, next) => {
    const start = Date.now();
    activeConnections.inc();
    res.on('finish', () => {
      const duration = Date.now() - start;
      httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
      activeConnections.dec();
    });
    next();
  });

  // Tenant resolution
  app.use(tenantMiddleware);

  // Authentication (optional – attaches user if token present)
  app.use(authenticate);

  // Idempotency for mutations
  app.use(idempotencyMiddleware);

  // Health endpoints (no tenant/auth needed)
  app.get('/health', healthController.liveness);
  app.get('/ready', healthController.readiness);
  app.get('/live', healthController.startup);
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // API routes
  app.use('/api/v1', v1Routes);

  // Serve admin dashboard (optional – can be served by Nginx)
  // app.use(express.static(path.join(__dirname, '../dist/admin')));

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};*/

/*
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestLogger } from './middleware/logging.middleware.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import v1Routes from './api/v1/routes/v1.routes.js';
import { healthController } from './monitoring/health.controller.js';

export const createApp = () => {
  const app = express();

  // 1. Security & infrastructure
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // 2. Correlation ID (must be before logging)
  app.use(correlationIdMiddleware);

  // 3. Request logging
  app.use(requestLogger);

  // 4. Global rate limiting
  app.use(globalRateLimiter);

  // 5. Tenant resolution (before auth)
  app.use(tenantMiddleware);

  // 6. Authentication (JWT)
  app.use(authenticate); // sets req.user, but allows unauthenticated for public routes? We'll refine.

  // 7. Health endpoints (no auth required, before versioning)
  app.get('/health', healthController.liveness);
  app.get('/ready', healthController.readiness);
  app.get('/live', healthController.startup);

  // 8. API routes
  app.use('/api/v1', v1Routes);

  // 9. Admin SPA static serving (optional, better served by Nginx)
  app.use(express.static(path.join(__dirname, '../dist/admin')));

  // 10. 404 handler
  app.use(notFoundHandler);

  // 11. Global error handler (last)
  app.use(errorHandler);

  return app;
};*/