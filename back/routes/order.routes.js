const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Créer une nouvelle commande
router.post('/', orderController.createOrder);

// Récupérer toutes les commandes de l'utilisateur
router.get('/', orderController.getUserOrders);

// Récupérer une commande spécifique
router.get('/:id', orderController.getOrder);

module.exports = router; 