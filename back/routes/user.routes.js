const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Protéger toutes les routes avec le middleware d'authentification
router.use(authMiddleware);

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', getUserProfile);

// Route pour mettre à jour le profil de l'utilisateur connecté
router.post('/profile', updateProfile);

// Routes protégées par le middleware admin
router.use(adminMiddleware);

// Route pour obtenir tous les utilisateurs (admin seulement)
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, siret, email, role, phone, address, city, postal_code, created_at, updated_at FROM users WHERE is_deleted = FALSE OR is_deleted IS NULL'
    );
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour créer un nouvel utilisateur (admin seulement)
router.post('/', async (req, res) => {
  try {
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;
    
    // Vérifier si l'email existe déjà
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    await db.query(
      `INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, siret, email, hashedPassword, role, phone, address, city, postal_code]
    );

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur (admin seulement)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;

    // Vérifier si l'utilisateur existe
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Préparer la requête de mise à jour
    let updateQuery = 'UPDATE users SET name = ?, siret = ?, email = ?, role = ?, phone = ?, address = ?, city = ?, postal_code = ?';
    const updateValues = [name, siret, email, role, phone, address, city, postal_code];

    // Ajouter le mot de passe à la mise à jour si fourni
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      updateValues.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateValues.push(userId);

    await db.query(updateQuery, updateValues);

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur (admin seulement)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Suppression logique : on met à jour le champ is_deleted
    await db.query('UPDATE users SET is_deleted = TRUE WHERE id = ?', [userId]);

    res.json({ message: 'Utilisateur masqué (suppression logique) avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router; 