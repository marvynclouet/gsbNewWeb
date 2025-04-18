const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');
const medicamentController = require('../controllers/medicament.controller');


router.get('/', medicamentController.getAllMedicaments);
router.post('/', auth, medicamentController.addNewOneMedicament);

router.get('/:id', medicamentController.getMedicamentById);
router.put('/:id', auth, medicamentController.updateOneMediacament );
router.delete('/:id', auth, medicamentController.deleteOneMedicament);


module.exports = router; 