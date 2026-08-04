import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { correlationIdMiddleware } from './middleware/correlationId.middleware.js';
import { requestLogger } from './middleware/logging.middleware.js';
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

export const createApp = (rateLimiters) => {
  const app = express();

  // Security headers
  securityMiddleware(app);

  // COMPRESSION (Optimized for production) 
  app.use(compression({
    level: process.env.NODE_ENV === 'production' ? 6 : 1,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      const contentType = res.getHeader('content-type');
      if (contentType && typeof contentType === 'string') {
        const skipCompression = ['image/', 'video/', 'audio/', 'application/octet-stream'];
        if (skipCompression.some(type => contentType.includes(type))) return false;
      }
      return compression.filter(req, res);
    }
  }));

  // BODY PARSER WITH REASONABLE LIMITS 
  app.use(express.json({ 
    limit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb',
    verify: (req, res, buf) => {
      if (buf.length > 1024 * 1024) {
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

  // RATE LIMITING 
  if (rateLimiters && rateLimiters.globalRateLimiter) {
    app.use(rateLimiters.globalRateLimiter);
    // Store endpoint-specific limiters on app for later use in routes
    app.set('contactRateLimiter', rateLimiters.contactRateLimiter);
    app.set('authRateLimiter', rateLimiters.authRateLimiter);
  }

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

  // HEALTH AND MONITORING ENDPOINTS
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
