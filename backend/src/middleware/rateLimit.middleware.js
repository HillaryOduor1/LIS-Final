import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/env.js';
import { MongooseStore } from './rateLimitStore.middleware.js';

const isDev = config.env === 'development';

export const createRateLimiters = (rateLimitModel) => {
  const createStore = (windowMs) => {
    return new MongooseStore({
      model: rateLimitModel,
      prefix: 'rl:',
      windowMs,
    });
  };

  // Tenant‑aware + route‑aware key generator
  const tenantOrIpKey = (req) => {
    const base = req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip);
    // Use full route path (includes parameters like /:id) + method
    const route = req.route?.path || req.path;
    return `${base}:${req.method}:${route}`;
  };

  // Shared handler for logging and consistent 429 response
  const rateLimitHandler = (req, res) => {
    // Log the violation with context
    const logger = req.log || console;
    logger.warn('Rate limit exceeded', {
      key: req.rateLimit?.key,
      tenantId: req.tenantId,
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.get('user-agent') || 'unknown',
    });
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((req.rateLimit?.resetTime - Date.now()) / 1000) || 60,
    });
  };

  // Global limiter – uses tenant or IP, dynamic max
  const globalRateLimiter = rateLimit({
    store: createStore(60 * 1000),
    windowMs: 60 * 1000,
    max: (req) => {
      if (isDev) return 1000;
      // Dynamic based on tenant plan
      const plan = req.tenant?.plan || 'free';
      switch (plan) {
        case 'enterprise': return 5000;
        case 'pro': return 1000;
        default: return 100;
      }
    },
    keyGenerator: tenantOrIpKey,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    // Do not skip successful requests – global limits apply to all
  });

  // Auth limiter – IP‑based, route aware, skip successful logins
  const authRateLimiter = rateLimit({
    store: createStore(15 * 60 * 1000),
    windowMs: 15 * 60 * 1000,
    max: isDev ? 50 : 5,
    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip);
      const route = req.route?.path || req.path;
      return `${ip}:${req.method}:${route}`;
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
  });

  // Contact limiter – IP‑based, route aware
  const contactRateLimiter = rateLimit({
    store: createStore(60 * 60 * 1000),
    windowMs: 60 * 60 * 1000,
    max: isDev ? 30 : 10,
    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip);
      const route = req.route?.path || req.path;
      return `${ip}:${req.method}:${route}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact requests, please try again later.' },
    handler: rateLimitHandler,
  });

  return { globalRateLimiter, authRateLimiter, contactRateLimiter };
};
