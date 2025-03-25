const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/register/all',authController.getAllUsers);
router.put('/profile', authenticate,authController.updateProfile);

module.exports = router;