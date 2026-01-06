const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// 👇 Ajouter cette ligne pour lister tous les utilisateurs
router.get('/', userController.getAllUsers);

module.exports = router;

