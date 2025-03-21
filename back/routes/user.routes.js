const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Protéger toutes les routes avec le middleware d'authentification
router.use(authMiddleware);

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, siret, email, role, phone, address, city, postal_code, created_at, updated_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
});

// Route pour mettre à jour le profil de l'utilisateur connecté
router.post('/profile', async (req, res) => {
  try {
    const { name, phone, address, city, postal_code } = req.body;
    const userId = req.user.userId;

    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
      [name, phone, address, city, postal_code, userId]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Route pour obtenir tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, siret, email, role, phone, address, city, postal_code, created_at, updated_at FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;
    
    // Vérifier si l'email existe déjà
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérifier si le SIRET existe déjà
    const [existingSiret] = await db.query('SELECT id FROM users WHERE siret = ?', [siret]);
    if (existingSiret.length > 0) {
      return res.status(400).json({ message: 'Ce numéro SIRET est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    const [result] = await db.query(
      'INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, siret, email, hashedPassword, role || 'user', phone, address, city, postal_code]
    );

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérifier si le SIRET est déjà utilisé par un autre utilisateur
    const [existingSiret] = await db.query('SELECT id FROM users WHERE siret = ? AND id != ?', [siret, userId]);
    if (existingSiret.length > 0) {
      return res.status(400).json({ message: 'Ce numéro SIRET est déjà utilisé' });
    }

    let updateQuery = 'UPDATE users SET name = ?, siret = ?, email = ?, role = ?, phone = ?, address = ?, city = ?, postal_code = ?';
    let params = [name, siret, email, role, phone, address, city, postal_code];

    // Ajouter le mot de passe à la requête uniquement s'il est fourni
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(userId);

    await db.query(updateQuery, params);

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router; 