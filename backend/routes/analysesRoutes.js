const express = require('express');
const router = express.Router();
const analysesController = require('../controllers/AnalyseController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate,analysesController.getAllAnalyses);
router.get('/home', authenticate,analysesController.getAllAnalysesForHome);
router.post('/',authenticate, analysesController.createAnalyse);
router.put('/:id',authenticate, analysesController.updateAnalyse);
router.delete('/:id',authenticate, analysesController.deleteAnalyse);

module.exports = router;