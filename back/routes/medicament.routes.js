const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');
const medicamentController = require('../controllers/medicament.controller');

// Obtenir tous les médicaments
router.get('/', medicamentController.getAllMedicaments);

// Obtenir un médicament par son ID
router.get('/:id', medicamentController.getMedicamentById);

// Ajouter un médicament (admin uniquement)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;

    const [result] = await db.query(
      'INSERT INTO medicaments (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, imageUrl, category]
    );

    res.status(201).json({
      message: 'Médicament ajouté avec succès',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du médicament' });
  }
});

// Mettre à jour un médicament (admin uniquement)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;

    await db.query(
      'UPDATE medicaments SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category = ? WHERE id = ?',
      [name, description, price, stock, imageUrl, category, req.params.id]
    );

    res.json({ message: 'Médicament mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du médicament' });
  }
});

// Supprimer un médicament (admin uniquement)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM medicaments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Médicament supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du médicament' });
  }
});

module.exports = router; 