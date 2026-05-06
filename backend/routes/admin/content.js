const express = require('express');
const router = express.Router();

const contentController = require('../../controllers/contentController'); // adjust path
const { protect, authorize } = require('../../middleware/auth'); // adjust path if needed

// Protect all routes
router.use(protect);
//get
router.get('/', async (req, res) => {
    res.json({ message: "content ok" });
});

// Update entire content (admin + editor)
router.put('/', authorize('admin', 'editor'), contentController.updateContent);

// Update specific section of a page (admin + editor)
router.put('/:page/:section', authorize('admin', 'editor'), contentController.updateSection);

// Delete content (admin only)
router.delete('/:id', authorize('admin'), contentController.deleteContent);

// Toggle publish/unpublish (admin only)
router.patch('/:id/publish', authorize('admin'), contentController.togglePublish);

module.exports = router;
/*const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', contentController.getAllContent);
router.get('/page/:page', contentController.getContentByPage);

// Protected routes
router.put('/', protect, authorize('admin', 'editor'), contentController.updateContent);
router.put('/:page/:section', protect, authorize('admin', 'editor'), contentController.updateSection);
router.delete('/:id', protect, authorize('admin'), contentController.deleteContent);
router.patch('/:id/publish', protect, authorize('admin'), contentController.togglePublish);

module.exports = router;*/