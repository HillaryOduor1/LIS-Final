const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const { protect, authorize } = require('../../middleware/auth');

// Protected routes
router.get('/', settingsController.getAllSettings);
router.put('/', protect, authorize('admin'), settingsController.updateSettings);
router.post('/reset', protect, authorize('admin'), settingsController.resetSettings);

module.exports = router;