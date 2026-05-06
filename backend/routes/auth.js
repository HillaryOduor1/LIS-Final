const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.post('/change-password', protect, authController.changePassword);
router.post('/switch-to-master', authController.switchToMaster);

module.exports = router;

/*const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;*/