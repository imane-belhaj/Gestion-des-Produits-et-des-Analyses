const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/register/all',authController.getAllUsers);
router.put('/profile', authMiddleware,authController.updateProfile);

module.exports = router;