const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');

// Obtenir le panier de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT ci.*, m.name, m.price, m.image_url 
       FROM cart_items ci 
       JOIN medicaments m ON ci.medicament_id = m.id 
       WHERE ci.user_id = ?`,
      [req.userId]
    );

    res.json(cartItems);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
  }
});

// Ajouter un médicament au panier
router.post('/add', auth, async (req, res) => {
  try {
    const { medicamentId, quantity } = req.body;

    // Vérifier si le médicament existe
    const [medicament] = await db.query('SELECT * FROM medicaments WHERE id = ?', [medicamentId]);
    if (medicament.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }

    // Vérifier le stock
    if (medicament[0].stock < quantity) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // Vérifier si le médicament est déjà dans le panier
    const [existingItem] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND medicament_id = ?',
      [req.userId, medicamentId]
    );

    if (existingItem.length > 0) {
      // Mettre à jour la quantité
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND medicament_id = ?',
        [quantity, req.userId, medicamentId]
      );
    } else {
      // Ajouter un nouvel article
      await db.query(
        'INSERT INTO cart_items (user_id, medicament_id, quantity) VALUES (?, ?, ?)',
        [req.userId, medicamentId, quantity]
      );
    }

    res.json({ message: 'Médicament ajouté au panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
  }
});

// Mettre à jour la quantité d'un article dans le panier
router.put('/update/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;

    // Vérifier si l'article existe dans le panier
    const [cartItem] = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    // Vérifier le stock
    const [medicament] = await db.query(
      'SELECT stock FROM medicaments WHERE id = ?',
      [cartItem[0].medicament_id]
    );

    if (medicament[0].stock < quantity) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // Mettre à jour la quantité
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, req.params.id]
    );

    res.json({ message: 'Quantité mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité' });
  }
});

// Supprimer un article du panier
router.delete('/remove/:id', auth, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    res.json({ message: 'Article supprimé du panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
  }
});

// Vider le panier
router.delete('/clear', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [req.userId]);
    res.json({ message: 'Panier vidé avec succès' });
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    res.status(500).json({ message: 'Erreur lors du vidage du panier' });
  }
});

module.exports = router; 