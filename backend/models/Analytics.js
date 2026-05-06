const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  tenantId: { type: String, index: true },
  page: String,
  event: String,
  type: { type: String, enum: ['pageview', 'event', 'funnel_step', 'heatmap'], default: 'pageview' },
  metadata: mongoose.Schema.Types.Mixed,   // store funnel step name, click coordinates, etc.
  timestamp: { type: Date, default: Date.now, index: true }
});

// Index for time‑based aggregations
analyticsSchema.index({ timestamp: -1, tenantId: 1 });
module.exports = mongoose.model('Analytics', analyticsSchema);