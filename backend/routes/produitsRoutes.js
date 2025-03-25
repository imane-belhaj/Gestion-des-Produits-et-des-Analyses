const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const authenticate = require('../middleware/authMiddleware');  // Include authentication middleware

router.get('/', authenticate, produitController.getAllProduits);
router.get('/home', authenticate, produitController.getAllProduitsForHome);
router.post('/', authenticate, produitController.createProduit);
router.put('/:id' ,authenticate, produitController.updateProduit);
router.delete('/:id',authenticate, produitController.deleteProduit);

module.exports = router;