const express = require('express');
const router = express.Router();
const path = require('path')

const fileProviderController = require('../controllers/files.provider.controller');

router.get('/medicaments/:fileName', (req, res) => {
    const medicamentPath = path.join(__dirname, '../uploads/medicaments/' + req.params.fileName)
    return res.sendFile(medicamentPath)
} );

module.exports = router; 