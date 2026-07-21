// src/middleware/payloadMonitor.js
import { logger } from '../config/logger.js';
import { config } from '../config/env.js';

const MAX_SIZE = config.maxPayloadSize;

export const payloadMonitor = (req, res, next) => {
  let size = 0;

  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_SIZE) {
      // Stop reading further data
      req.destroy();
      if (!res.headersSent) {
        res.status(413).json({ error: 'Payload too large' });
      }
    }
  });

  req.on('end', () => {
    if (size > MAX_SIZE) {
      logger.warn({
        path: req.path,
        size: `${(size / 1024 / 1024).toFixed(2)}MB`,
        ip: req.ip,
        reqId: req.id,
      }, 'Oversized payload rejected');
    } else {
      // Optionally log large payloads as warning
      if (size > MAX_SIZE * 0.8) {
        logger.warn({
          path: req.path,
          size: `${(size / 1024 / 1024).toFixed(2)}MB`,
          ip: req.ip,
          reqId: req.id,
        }, 'Large payload detected (still accepted)');
      }
    }
  });

  next();
};
/*
// backend/src/middleware/payloadMonitor.js
export const payloadMonitor = (req, res, next) => {
  const originalJson = req.json;
  let size = 0;
  
  req.on('data', chunk => {
    size += chunk.length;
  });
  
  req.on('end', () => {
    if (size > 1024 * 1024) { // > 1MB
      logger.warn({
        path: req.path,
        size: `${(size / 1024 / 1024).toFixed(2)}MB`,
        ip: req.ip
      }, 'Large payload detected');
    }
  });
  
  next();
};

// Use it after compression
app.use(payloadMonitor);*/