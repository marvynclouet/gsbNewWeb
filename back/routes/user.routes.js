const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');


//GB, Protect all routes using authentification middleware
router.use(authMiddleware);

// Here we have the serveices 

router.post('/', userController.createOneNewUser);
router.get('/', userController.getAllUsersInformation);
router.delete('/:id', userController.deleteOneSpecificUser);
router.put('/:id', userController.updateAllSpecicUserInformation);
router.get('/profile', userController.getConnectedUserProfilInfo);
router.post('/profile', userController.changeConnectedUserProfilInfo);

module.exports = router; 