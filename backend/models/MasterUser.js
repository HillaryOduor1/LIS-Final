const mongoose = require('mongoose');

const masterUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: String,
  googleId: String,
  role: {
    type: String,
    enum: ['superadmin'],
    default: 'superadmin'
  },
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('MasterUser', masterUserSchema);