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
router.post('/', auth, medicamentController.addNewOneMedicament);


// Mettre à jour un médicament (admin uniquement)
router.put('/:id', auth, medicamentController.updateOneMediacament );


// Supprimer un médicament (admin uniquement)
router.delete('/:id', auth, medicamentController.deleteOneMedicament);


module.exports = router; 