import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  hits: { type: Number, default: 0 },
  resetTime: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

// Ensure the index is created (call once after model compilation)
rateLimitSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 });

export const rateLimitSchemaObj = rateLimitSchema;

export const getRateLimitModel = (connection) => {
  return connection.model('RateLimit', rateLimitSchema);
};
/*import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  hits: { type: Number, default: 0 },
  resetTime: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const rateLimitSchemaObj = rateLimitSchema;

export const getRateLimitModel = (connection) => {
  return connection.model('RateLimit', rateLimitSchema);
};*/




/*import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  hits: { type: Number, default: 0 },
  resetTime: { type: Date, required: true },
  expireAt: { type: Date, index: { expires: 0 } },
});

rateLimitSchema.pre('save', function(next) {
  this.expireAt = this.resetTime;
  next();
});

// Export the schema for registration on a specific connection
export const rateLimitSchemaObj = rateLimitSchema;

// Helper to get the model on a given connection
export const getRateLimitModel = (connection) => {
  return connection.model('RateLimit', rateLimitSchema);
};*/
/*import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  hits: { type: Number, default: 0 },
  resetTime: { type: Date, required: true },
  // TTL index to auto-delete after resetTime
  expireAt: { type: Date, index: { expires: 0 } }, // expire at specific time
});

rateLimitSchema.pre('save', function(next) {
  // Set expireAt to resetTime (MongoDB will auto-delete after that time)
  this.expireAt = this.resetTime;
  next();
});

export const RateLimitModel = mongoose.model('RateLimit', rateLimitSchema);*/