const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authenticate = require('../middleware/authMiddleware');

router.post('/',authenticate, unitController.createUnit);
router.get('/',authenticate,unitController.getAllUnits);

module.exports = router;