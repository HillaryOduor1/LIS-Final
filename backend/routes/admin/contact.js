const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth'); // adjust path if needed
const { getMessages, markAsRead, deleteMessage } = require('../../controllers/admin/contactController');

// All routes require authentication and admin/editor role
router.use(protect);
router.use(authorize('admin', 'editor'));

router.get('/', getMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;

/*const express = require('express');
const router = express.Router();
const { getMessages, markAsRead, deleteMessage } = require('../../controllers/admin/contactController');
const { authenticate, authorize } = require('../../middleware/auth'); // adjust based on your auth middleware

router.use(authenticate);
router.use(authorize(['admin', 'editor'])); // only admins/editors can view messages

router.get('/', getMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;*/