export class MongooseStore {
  constructor({ model, prefix = 'rl:', windowMs = 60 * 1000 }) {
    this.model = model;
    this.prefix = prefix;
    this.windowMs = windowMs;
  }

  async increment(key) {
    const fullKey = this.prefix + key;
    const resetTime = new Date(Date.now() + this.windowMs);

    // Use MongoDB aggregation pipeline with $$NOW for server time
    const doc = await this.model.findOneAndUpdate(
      { key: fullKey },
      [
        {
          $set: {
            hits: {
              $cond: [
                { $lt: ['$resetTime', '$$NOW'] },
                1,
                { $add: [{ $ifNull: ['$hits', 0] }, 1] }
              ]
            },
            resetTime: {
              $cond: [
                { $lt: ['$resetTime', '$$NOW'] },
                resetTime,
                { $ifNull: ['$resetTime', resetTime] }
              ]
            }
          }
        }
      ],
      {
        upsert: true,
        new: true,
        updatePipeline: true, // required for array syntax
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
      }
    );

    return {
      totalHits: doc.hits,
      resetTime: doc.resetTime,
    };
  }

  async decrement(key) {
    const fullKey = this.prefix + key;
    // Atomic decrement – prevent negative hits using $max
    await this.model.updateOne(
      { key: fullKey },
      [
        {
          $set: {
            hits: {
              $max: [{ $subtract: ['$hits', 1] }, 0]
            }
          }
        }
      ],
      {
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
      }
    );
  }

  async resetKey(key) {
    const fullKey = this.prefix + key;
    await this.model.deleteOne({ key: fullKey });
  }

  async resetAll() {
    await this.model.deleteMany({});
  }
}
/*export class MongooseStore {
  constructor({ model, prefix = 'rl:', windowMs = 60 * 1000 }) {
    this.model = model;
    this.prefix = prefix;
    this.windowMs = windowMs;
  }

  async increment(key) {
    const fullKey = this.prefix + key;
    const now = new Date();
    const resetTime = new Date(now.getTime() + this.windowMs);

    // Atomic update using MongoDB aggregation pipeline
    const doc = await this.model.findOneAndUpdate(
      { key: fullKey },
      [
        {
          $set: {
            hits: {
              $cond: [
                { $lt: ['$resetTime', now] },
                1,
                { $add: ['$hits', 1] }
              ]
            },
            resetTime: {
              $cond: [
                { $lt: ['$resetTime', now] },
                resetTime,
                '$resetTime'
              ]
            }
          }
        }
      ],
      {
        upsert: true,
        new: true,
        updatePipeline: true, // <-- crucial: tells Mongoose to treat the array as pipeline
      }
    );

    return {
      totalHits: doc.hits,
      resetTime: doc.resetTime,
    };
  }

  async decrement(key) {
    const fullKey = this.prefix + key;
    const record = await this.model.findOne({ key: fullKey });
    if (record) {
      record.hits = Math.max(0, record.hits - 1);
      await record.save();
    }
  }

  async resetKey(key) {
    const fullKey = this.prefix + key;
    await this.model.deleteOne({ key: fullKey });
  }

  async resetAll() {
    await this.model.deleteMany({});
  }
}*/




/*export class MongooseStore {
  constructor({ model, prefix = 'rl:', windowMs = 60 * 1000 }) {
    this.model = model;
    this.prefix = prefix;
    this.windowMs = windowMs;
  }

  async increment(key) {
    const fullKey = this.prefix + key;
    const now = new Date();

    let record = await this.model.findOne({ key: fullKey });
    if (record && record.resetTime < now) {
      record.hits = 1;
      record.resetTime = new Date(now.getTime() + this.windowMs);
    } else if (record) {
      record.hits += 1;
    } else {
      record = new this.model({
        key: fullKey,
        hits: 1,
        resetTime: new Date(now.getTime() + this.windowMs),
      });
    }
    await record.save();
    return {
      totalHits: record.hits,
      resetTime: record.resetTime,
    };
  }

  async decrement(key) {
    const fullKey = this.prefix + key;
    const record = await this.model.findOne({ key: fullKey });
    if (record) {
      record.hits = Math.max(0, record.hits - 1);
      await record.save();
    }
  }

  async resetKey(key) {
    const fullKey = this.prefix + key;
    await this.model.deleteOne({ key: fullKey });
  }

  async resetAll() {
    await this.model.deleteMany({});
  }
}*/
/*import { RateLimitModel } from '../database/models/rateLimit.model.js';

/**
 * Custom MongoDB store for express-rate-limit using Mongoose
 /
export class MongooseStore {
  constructor(options = {}) {
    this.prefix = options.prefix || 'rl:';
    this.model = options.model || RateLimitModel;
    this.windowMs = options.windowMs || 60 * 1000; // default 1 minute
  }
  setWindowMs(windowMs) {
    this.windowMs = windowMs;
  }

  async increment(key) {
    const fullKey = this.prefix + key;
    const now = new Date();

    let record = await this.model.findOne({ key: fullKey });
    if (record && record.resetTime < now) {
      // Reset
      record.hits = 1;
      record.resetTime = new Date(now.getTime() + this.windowMs);
    } else if (record) {
      record.hits += 1;
    } else {
      record = new this.model({
        key: fullKey,
        hits: 1,
        resetTime: new Date(now.getTime() + this.windowMs),
      });
    }
    await record.save();
    return {
      totalHits: record.hits,
      resetTime: record.resetTime,
    };
  }

  async decrement(key) {
    const fullKey = this.prefix + key;
    const record = await this.model.findOne({ key: fullKey });
    if (record) {
      record.hits = Math.max(0, record.hits - 1);
      await record.save();
    }
  }

  async resetKey(key) {
    const fullKey = this.prefix + key;
    await this.model.deleteOne({ key: fullKey });
  }

  // Required by express-rate-limit
  async resetAll() {
    await this.model.deleteMany({});
  }

  // We need to set windowMs from the limiter's options.
  // The store doesn't receive windowMs directly, but we can set it when we create the store instance.
  setWindowMs(windowMs) {
    this.windowMs = windowMs;
  }
}*/