const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const imageController = require('../controllers/image.controller');

// Configuration de multer pour le stockage en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// Upload d'une image (admin uniquement)
router.post('/upload', [auth, admin, upload.single('image')], imageController.uploadImage);

// Récupérer une image
router.get('/:id', imageController.getImage);

// Supprimer une image (admin uniquement)
router.delete('/:id', [auth, admin], imageController.deleteImage);

module.exports = router; 