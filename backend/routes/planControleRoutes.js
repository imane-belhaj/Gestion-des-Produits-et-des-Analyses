const express = require('express');
const router = express.Router();
const planControleController = require('../controllers/planControleController');


router.get('/all',planControleController.getAllPlans);
router.get('/',planControleController.getPlans);
router.post('/', planControleController.createPlan);
router.put('/:id' , planControleController.updatePlan);
router.delete('/:id' , planControleController.deletePlan);

module.exports = router;