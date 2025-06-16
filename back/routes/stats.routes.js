const express = require('express');
const router = express.Router();
const db = require('../config/db.config'); // adapte selon ton projet

router.get('/stats', async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id, 10);
    console.log('--- [API /stats] ---');
    console.log('userId reçu pour stats:', userId, '| Type:', typeof userId);

    // Nombre total de médicaments (pour tout le monde)
    const [medicaments] = await db.query('SELECT COUNT(*) AS count FROM medicaments WHERE is_deleted = FALSE OR is_deleted IS NULL');
    console.log('Résultat SQL medicaments:', medicaments);

    let commandes = 0;
    let livraisons = 0;

    if (!isNaN(userId) && userId > 0) {
      // Commandes en cours (pending) pour ce user
      console.log("Requête SQL commandes:", "SELECT COUNT(*) AS count FROM orders WHERE status = 'pending' AND user_id = ?", userId);
      const [orders] = await db.query(
        "SELECT COUNT(*) AS count FROM orders WHERE status = 'pending' AND user_id = ?",
        [userId]
      );
      console.log('Résultat SQL commandes:', orders);
      commandes = orders[0].count;

      // Livraisons prévues (shipped) pour ce user
      console.log("Requête SQL livraisons:", "SELECT COUNT(*) AS count FROM orders WHERE status = 'shipped' AND user_id = ?", userId);
      const [livs] = await db.query(
        "SELECT COUNT(*) AS count FROM orders WHERE status = 'shipped' AND user_id = ?",
        [userId]
      );
      console.log('Résultat SQL livraisons:', livs);
      livraisons = livs[0].count;
    } else {
      console.log('Aucun userId fourni ou userId invalide');
      commandes = 0;
      livraisons = 0;
    }

    console.log('Stats renvoyées:', {
      medicaments: medicaments[0].count,
      commandes,
      livraisons
    });

    res.json({
      medicaments: medicaments[0].count,
      commandes,
      livraisons
    });
  } catch (err) {
    console.error('Erreur dans /stats:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
});

module.exports = router;
