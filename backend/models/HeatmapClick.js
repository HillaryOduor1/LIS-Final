const mongoose = require('mongoose');

const heatmapClickSchema = new mongoose.Schema({
  tenantId: String,
  page: String,
  x: Number,        // relative X coordinate (0-1)
  y: Number,        // relative Y coordinate (0-1)
  element: String,  // optional CSS selector
  sessionId: String,
  timestamp: { type: Date, default: Date.now, expires: '90d' } // auto-delete after 90 days
});
heatmapClickSchema.index({ page: 1, tenantId: 1 });
module.exports = mongoose.model('HeatmapClick', heatmapClickSchema);