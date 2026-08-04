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
