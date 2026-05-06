const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activityController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), activityController.getActivityLogs);
router.get('/stats', authorize('admin'), activityController.getActivityStats);
router.delete('/clear', authorize('admin'), activityController.clearLogs);

module.exports = router;