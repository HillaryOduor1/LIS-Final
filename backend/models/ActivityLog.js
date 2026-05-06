// models/ActivityLog.js

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'settings_save',
      'content_update',
      'content_publish',
      'content_unpublish',
      'content_section_update',   // optional, if you use it
      'user_login',
      'user_logout',
      'user_create',
      'user_update',
      'user_delete',
      'user_toggle_status',       // ✅ added for toggleStatus
      'media_upload',
      'media_delete'
    ]
  },
  label: {
    type: String,
    required: true
  },
  detail: String,
  user: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: mongoose.Schema.Types.Mixed
});

// Indexes
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });

module.exports = activityLogSchema;
/*const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
    
      'settings_save',
      'content_update',
      'user_login',
      'user_logout',
      'user_create',
      'user_update',
      'user_delete',
      'content_publish',
      'content_unpublish',
      'media_upload',
      'media_delete'
    ]
  },
  label: {
    type: String,
    required: true
  },
  detail: String,
  user: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: mongoose.Schema.Types.Mixed
});

// Index for efficient querying
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });

//module.exports = mongoose.model('ActivityLog', activityLogSchema);
module.exports = activityLogSchema;*/