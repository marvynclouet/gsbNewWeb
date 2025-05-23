const fs = require('fs')
const path = require('path')
const db = require('../config/db.config');

  
// GB, Get All rthe medicaments disponible in bdd (database)

exports.getAllMedicaments = async (req, res) => {
    try {
      const [medicaments] = await db.query(
        'SELECT * FROM medicaments ORDER BY name ASC'
      );
      return res.json(medicaments);
    }
    catch (error) {
      console.error('Erreur lors de la création de l\'order (la commande): ', error);
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
      console.error('Erreur lors de la récupération du médicament: ', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du médicament' });
    }
}


//GB, Here You can add one specific medicament 

exports.addNewOneMedicament = async (req, res) => {
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
}


// GB, Here you can update one specific medicament 

exports.updateOneMediacament = async (req, res) => {
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
      sqlParams = [name, description, price, stock, exsitingMedicament[0].image_url, id]
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
}


// GB, Here we can delete one specific medicament

exports.deleteOneMedicament = async (req, res) => {
  try {

    let exsitingMedicament;
    const { id }= req.params


    const response = await db.query(
      "SELECT image_url FROM Medicaments WHERE id= ?",
      [id]
    )

    if(response && !Array.isArray(response[0])){
      return res.status(400).json({message: "Such an medicament with this id doesn't exist"})
    }

    const deleteResponse = await db.query('DELETE FROM medicaments WHERE id = ?', [req.params.id]);

    if( deleteResponse.affectedRows < 1 ){
      return res.status(400).json({message: "Such an medicament with this id doesn't exist"})
    }


    exsitingMedicament = response[0]

    console.log(exsitingMedicament)

    if(!exsitingMedicament[0].image_url.toString().includes('http')){
      const filePath = path.join(__dirname, `../uploads/medicaments/${exsitingMedicament[0].image_url}`)
      console.log({filePath})
      fs.unlink(filePath, async (err)=>{
        if(err){
          return res.status(400).json({message: "Such an medicament with this id doesn't exist"})
        }
        console.log("Delete file succed")
        return res.json({ message: 'Médicament supprimé avec succès' });
      })
    }

  }
  catch (error) {
    console.error('Erreur lors de la suppression du médicament : ', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression du médicament' });
  }
}