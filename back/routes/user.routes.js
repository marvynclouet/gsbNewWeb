const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const db = require('../config/db.config');

// Protéger toutes les routes avec le middleware d'authentification
router.use(authMiddleware);

// Route pour obtenir le profil de l'utilisateur
router.get('/profile', getUserProfile);

// Route pour mettre à jour le profil
router.post('/profile', updateProfile);

// Mettre à jour le profil de l'utilisateur
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, address, birthDate, socialSecurity } = req.body;

    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, birth_date = ?, social_security = ? WHERE id = ?',
      [name, phone, address, birthDate, socialSecurity, req.userId]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Mettre à jour la photo de profil
router.put('/profile/picture', async (req, res) => {
  try {
    const { profilePicture } = req.body;

    await db.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profilePicture, req.userId]
    );

    res.json({ message: 'Photo de profil mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo' });
  }
});

module.exports = router; 