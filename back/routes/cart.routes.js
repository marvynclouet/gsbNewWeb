const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controller')


router.get('/', auth, cartController.getSpecificUserCartItem );
router.post('/add', auth, cartController.addProductToOneSpecificUserCart);
router.put('/update/:id', auth, cartController.updateOneSpecificCartItemQuantity);
router.delete('/remove/:id', auth, cartController.deleteOneSpecificCartItem);
router.delete('/clear', auth, cartController.clearOneSpecificUserCart);

module.exports = router; 