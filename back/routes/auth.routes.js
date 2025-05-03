const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route de connexion
router.post('/login', authController.login);

// Route d'inscription
router.post('/register', authController.register);

module.exports = router; 