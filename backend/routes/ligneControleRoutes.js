const express = require('express');
const router = express.Router();
const ligneControleController = require('../controllers/ligneControleController');


router.get('/all', ligneControleController.getAllLignes);
router.get('/', ligneControleController.getLignes);
router.post('/', ligneControleController.createLigne);
router.put('/:id', ligneControleController.updateLigne);
router.delete('/:id', ligneControleController.deleteLigne);

module.exports = router;