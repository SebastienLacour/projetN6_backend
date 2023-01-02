// Importation d'express
const express = require('express');

// création de la fonction Router
const router = express.Router();

// Importation du controller
const userCtrl = require('../controller/user');

// Route signup
router.post("/signup", userCtrl.signup);

// Route login
router.post("/login" , userCtrl.login);

//exportation du module
module.exports = router;