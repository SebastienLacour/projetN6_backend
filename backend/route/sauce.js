// Importation d'express
const express = require('express');

// création de la fonction Router
const router = express.Router();

// Importation du middleware d'authentification
const auth = require('../middleware/auth');

//Importation du middleware multer pour la gestion des images
const multer = require('../middleware/multer');

//Importation du controller des routes sauce
const sauceCtrl = require('../controller/sauce');

//Importation du controller qui va gérer les like
const likeCtrl = require('../controller/like');

//Les routes 
router.post('/sauces', auth, multer, sauceCtrl.createSauce);
router.get('/sauces', auth, sauceCtrl.readSauce);
router.get('/sauces/:id', auth, sauceCtrl.readOneSauce);
router.put('/sauces/:id', auth, multer,  sauceCtrl.updateOneSauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/sauces/:id/like', auth, likeCtrl.likeSauce);

module.exports = router