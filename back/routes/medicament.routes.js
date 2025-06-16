const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');
const medicamentController = require('../controllers/medicament.controller');

// Recherche de médicaments par nom (query param: q)
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [results] = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE name LIKE ? AND (is_deleted = FALSE OR is_deleted IS NULL)",
      [`%${q}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
});

// Obtenir tous les médicaments
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE is_deleted = FALSE OR is_deleted IS NULL"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
});

// Obtenir un médicament par son ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE id = ? AND (is_deleted = FALSE OR is_deleted IS NULL)",
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
});

// Ajouter un médicament (admin uniquement)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    // Vérifier si l'URL de l'image est valide
    if (image_url && !image_url.startsWith('http://') && !image_url.startsWith('https://')) {
      return res.status(400).json({ message: 'L\'URL de l\'image doit commencer par http:// ou https://' });
    }

    const [result] = await db.query(
      'INSERT INTO medicaments (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url]
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
    console.log('Corps complet de la requête:', req.body);
    const { name, description, price, stock, image_url } = req.body;
    console.log('Données extraites:', { name, description, price, stock, image_url });

    // Vérifier si l'URL de l'image est valide
    if (image_url && !image_url.startsWith('http://') && !image_url.startsWith('https://')) {
      return res.status(400).json({ message: 'L\'URL de l\'image doit commencer par http:// ou https://' });
    }

    // D'abord, récupérer les données actuelles du médicament
    const [currentMedicament] = await db.query(
      'SELECT * FROM medicaments WHERE id = ?',
      [req.params.id]
    );
    console.log('Données actuelles du médicament:', currentMedicament[0]);

    // Utiliser la nouvelle image si elle est fournie, sinon garder l'ancienne
    const finalImageUrl = image_url !== undefined ? image_url : currentMedicament[0]?.image_url;
    console.log('Image finale qui sera utilisée:', finalImageUrl);

    const [updateResult] = await db.query(
      'UPDATE medicaments SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock, finalImageUrl, req.params.id]
    );
    console.log('Résultat de la mise à jour:', updateResult);

    // Vérifier si la mise à jour a réussi
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé ou aucune modification effectuée' });
    }

    // Récupérer les données mises à jour pour vérification
    const [updatedMedicament] = await db.query(
      'SELECT * FROM medicaments WHERE id = ?',
      [req.params.id]
    );
    console.log('Données après mise à jour:', updatedMedicament[0]);

    res.json({ 
      message: 'Médicament mis à jour avec succès',
      medicament: updatedMedicament[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du médicament' });
  }
});

// Supprimer un médicament (admin uniquement)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('UPDATE medicaments SET is_deleted = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Médicament marqué comme supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du médicament' });
  }
});

module.exports = router; 