const db = require('../config/db.config');


  
// GB, Get All rthe medicaments disponible in bdd (database)

exports.getAllMedicaments = async (req, res) => {
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

  
// GB, Get medicament by its id

exports.getMedicamentById = async (req, res) => {
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


//GB, Here You can add one specific medicament 

exports.addNewOneMedicament = async (req, res) => {
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
}


// GB, Here you can update one specific medicament 

exports.updateOneMediacament = async (req, res) => {
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
}


// GB, Here we can delete one specific medicament

exports.deleteOneMedicament = async (req, res) => {
  try {
    await db.query('DELETE FROM medicaments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Médicament supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du médicament' });
  }
}