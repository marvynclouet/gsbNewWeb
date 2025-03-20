const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

// Route de connexion
router.post('/login', login);

// Route d'inscription
router.post('/register', register);

module.exports = router; 