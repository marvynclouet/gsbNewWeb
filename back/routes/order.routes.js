const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const verifyAdminRoleMiddleware = require('../middleware/admin.action.middleware');


router.use(authMiddleware);

router.get('/all', verifyAdminRoleMiddleware, orderController.getAllOrders);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id', verifyAdminRoleMiddleware, orderController.modifyOneSpecificOrder);
router.put('/:id/status', verifyAdminRoleMiddleware, orderController.updateOneSpecificCommandStatus);

router.delete('/:id', verifyAdminRoleMiddleware, orderController.deleteOneSpecificCommand);

module.exports = router; 