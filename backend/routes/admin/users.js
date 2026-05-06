const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { protect, authorize } = require('../../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.createUser);
router.put('/:id', authorize('admin'), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.patch('/:id/toggle-status', authorize('admin'), userController.toggleUserStatus);

module.exports = router;