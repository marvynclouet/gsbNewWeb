const fs = require('fs')
const path = require('path')
const express = require('express');
const router = express.Router();
const multer = require('multer')

const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');

const storage = multer.memoryStorage()
const upload = multer( { storage } )

const medicamentController = require('../controllers/medicament.controller');



// Recherche de médicaments par nom (query param: q)
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [results] = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE name LIKE ?",
      [`%${q}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err });
  }
});



// Obtenir tous les médicaments
router.get('/', medicamentController.getAllMedicaments);



// Obtenir un médicament par son ID
router.get('/:id', medicamentController.getMedicamentById);



// Ajouter un médicament (admin uniquement)
router.post('/', upload.single('image_file'), auth, async (req, res) => {
  try {
    let sqlParams;
    const file = req.file;
    const { name, description, price, stock, image_url, category } = req.body;

    if(image_url){
      sqlParams = [name, description, price, stock, image_url, category]
    }
    else if(file){
      const fileName = Date.now() + file.originalname
      const filePath = path.join(__dirname, '../uploads/medicaments/'+ fileName)
      fs.writeFileSync(filePath, file.buffer)
      sqlParams = [name, description, price, stock, fileName, category]
    }
    else{
      return res.status(500).json({ message: 'Image data missing' });
    }

    const [result] = await db.query(
      'INSERT INTO medicaments (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      sqlParams,
    );

    if(!result){
      console.error('Quelques chose ne va pas (bdd response) ', error);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout du médicament' });
    }

    return res.status(201).json({
      message: 'Médicament ajouté avec succès',
      id: result.insertId
    });
  }
  catch (error) {
    console.error('Erreur lors de l\'ajout du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du médicament' });
  }
});




// Mettre à jour un médicament (admin uniquement)
router.put('/:id', auth, upload.single("image_file"),  async (req, res) => {
    try {
    let sqlParams;
    const file = req.file;
    let exsitingMedicament;
    const { id } = req.params;
    const { name, description, price, stock, image_url, category } = req.body ;

    const response = await db.query(
      "SELECT image_url FROM Medicaments WHERE id= ?",
      [id]
    )

    if(response && !Array.isArray(response[0])){
      return res.status(400).json({message: "Such an medicament with this id doesn't exist"})
    }

    exsitingMedicament = response[0]

    if(image_url){
      sqlParams = [name, description, price, stock, image_url, id]
    }
    else if(file){
      const fileName = Date.now() + file.originalname
      const filePath = path.join(__dirname, '../uploads/medicaments/'+ fileName)
      fs.writeFileSync(filePath, file.buffer)
      sqlParams = [name, description, price, stock, fileName, id]
    }
    else{
      sqlParams = [ name, description, price, stock, exsitingMedicament[0].image_url, id ]
    }

    await db.query(
      `
        UPDATE medicaments SET name = ?, description = ?, 
               price = ?, stock = ?, image_url = ?
        WHERE id = ?
      `,
      sqlParams
    );

    return res.status(200).json({ message: 'Médicament mis à jour avec succès' });
  }
  catch (error) {
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