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
/*import rateLimit from 'express-rate-limit';
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

  // For tenant‑aware global limiting: use tenant ID if present, else IP
  const tenantOrIpKey = (req) => {
    return req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip);
  };

  const globalRateLimiter = rateLimit({
    store: createStore(60 * 1000),
    windowMs: 60 * 1000,
    max: isDev ? 1000 : 100,
    keyGenerator: tenantOrIpKey,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Auth limiter – always IP‑based (login attempts from any IP)
  const authRateLimiter = rateLimit({
    store: createStore(15 * 60 * 1000),
    windowMs: 15 * 60 * 1000,
    max: isDev ? 50 : 5,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    skipSuccessfulRequests: true,
  });

  // Contact limiter – IP‑based for public form
  const contactRateLimiter = rateLimit({
    store: createStore(60 * 60 * 1000),
    windowMs: 60 * 60 * 1000,
    max: isDev ? 30 : 10,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact requests, please try again later.' },
  });

  return { globalRateLimiter, authRateLimiter, contactRateLimiter };
};*/


/*import rateLimit from 'express-rate-limit';
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

  const globalRateLimiter = rateLimit({
    store: createStore(60 * 1000),
    windowMs: 60 * 1000,
    max: isDev ? 1000 : 100,
    keyGenerator: (req) => req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip),
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authRateLimiter = rateLimit({
    store: createStore(15 * 60 * 1000),
    windowMs: 15 * 60 * 1000,
    max: isDev ? 50 : 5,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    skipSuccessfulRequests: true,
  });

  const contactRateLimiter = rateLimit({
    store: createStore(60 * 60 * 1000),
    windowMs: 60 * 60 * 1000,
    max: isDev ? 30 : 10,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact requests, please try again later.' },
  });

  return { globalRateLimiter, authRateLimiter, contactRateLimiter };
};*/

/*import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/env.js';
import { MongooseStore } from './rateLimitStore.middleware.js'

const isDev = config.env === 'development';

// Shared store instance – we'll set windowMs per limiter later
const createStore = (windowMs) => {
  const store = new MongooseStore({ prefix: 'rl:' });
  store.setWindowMs(windowMs);
  return store;
};

export const globalRateLimiter = rateLimit({
  store: createStore(60 * 1000), // 1 minute
  windowMs: 60 * 1000,
  max: isDev ? 1000 : 100,
  keyGenerator: (req) => req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: createStore(15 * 60 * 1000), // 15 minutes
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  skipSuccessfulRequests: true,
});

export const contactRateLimiter = rateLimit({
  store: createStore(60 * 60 * 1000), // 1 hour
  windowMs: 60 * 60 * 1000,
  max: isDev ? 30 : 10,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests, please try again later.' },
});*/

/*
// src/middleware/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/env.js';

const isDev = config.env === 'development';

// Global rate limiter – uses MemoryStore by default
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 1000 : 100,
  keyGenerator: (req) => req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  // MemoryStore is default
});

// Auth rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 50 : 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  skipSuccessfulRequests: true,
});

// Endpoint‑specific for contact form – stricter
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 30 : 10,      // 10 submissions per hour per IP
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests, please try again later.' },
});*/


/*
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import { ipKeyGenerator } from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000,
  max: isDev ? 1000 : 100, // much higher in dev
  keyGenerator: (req) => req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  skipSuccessfulRequests: true,
});*/

/*import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import { ipKeyGenerator } from 'express-rate-limit'; // <-- Import the helper

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  keyGenerator: (req) => {
    // If you have a tenant ID, use it as the primary key
    if (req.tenantId) {
      return `tenant:${req.tenantId}`;
    }
    // IMPORTANT: For IP fallbacks, use ipKeyGenerator(req.ip)
    // This applies a /56 subnet mask to IPv6 addresses to prevent bypasses.
    return ipKeyGenerator(req.ip);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip), // <-- Always use ipKeyGenerator when keying by IP
  skipSuccessfulRequests: true,
});*/

/*import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.tenantId || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip,
  skipSuccessfulRequests: true,
});*/