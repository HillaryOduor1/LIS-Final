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
    // Atomic decrement, prevents negative hits using $max
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
