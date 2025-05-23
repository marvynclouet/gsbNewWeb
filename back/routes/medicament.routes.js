const express = require('express');
const router = express.Router();
const multer = require('multer')
const db = require('../config/db.config');
const auth = require('../middleware/auth.middleware');
const medicamentController = require('../controllers/medicament.controller');

const storage = multer.memoryStorage()
const upload = multer( { storage } )

router.get( '/', medicamentController.getAllMedicaments );
router.post('/', upload.single("image_file"), auth, medicamentController.addNewOneMedicament);

router.get('/:id', medicamentController.getMedicamentById);
router.put('/:id', auth, upload.single("image_file"), medicamentController.updateOneMediacament );
router.delete( '/:id', auth, medicamentController.deleteOneMedicament );


module.exports = router; 