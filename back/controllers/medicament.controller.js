const db = require('../config/db.config');

const medicamentController = {
  // Récupérer tous les médicaments
  getAllMedicaments: async (req, res) => {
    try {
      const [medicaments] = await db.query(
        'SELECT * FROM medicaments ORDER BY name ASC'
      );
      res.json(medicaments);
    } catch (error) {
      console.error('Erreur lors de la récupération des médicaments:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des médicaments' });
    }
  },

  // Récupérer un médicament par son ID
  getMedicamentById: async (req, res) => {
    try {
      const [medicaments] = await db.query(
        'SELECT * FROM medicaments WHERE id = ?',
        [req.params.id]
      );

      if (medicaments.length === 0) {
        return res.status(404).json({ message: 'Médicament non trouvé' });
      }

      res.json(medicaments[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération du médicament:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du médicament' });
    }
  }
};

module.exports = medicamentController; 