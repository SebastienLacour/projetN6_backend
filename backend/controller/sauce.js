// Importation du model de sauce
const sauce = require('../models/sauce');
const saucesModel = require('../models/sauce');
const user = require('../models/user');

//Importation de fs
const fs = require('fs')


// Créer la sauce dans la base de donnée
exports.createSauce = (req, res, next) => {
    console.log("------------------- CREATE SAUCE --------------------------")
    console.log(req.body)
    delete req.body._id
    let sauceObject = JSON.parse(req.body.sauce)

    console.log("sauceObject")
    console.log(sauceObject)
    console.log("req.protocol")
    console.log(req.protocol);
    console.log(req.get("host"));
    console.log(req.file.filename);
    let sauce = new saucesModel({
        ...sauceObject,
        likes: 0,
        dislikes: 0,

        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    // sauce = {sauceObject, like: 0, dislike: 0};
    console.log("sauce", sauce)
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce crée dans la base de donnée', contenu: sauceObject }))
        .catch(error => res.status(400).json({ error }))

    next
}

// Lire toutes les sauces 
exports.readSauce = (req, res, next) => {
    saucesModel.find()
        .then((allSauces) => res.status(200).json(allSauces))
        .catch(error => res.status(400).json({ error }))

    next
}

// Lire une sauce
exports.readOneSauce = (req, res, next) => {
    saucesModel.findOne({ _id: req.params.id })
        .then((oneSauce) => res.status(200).json(oneSauce))
        .catch(error => res.status(400).json({ error }))

    next
}

// Modifier une sauce
exports.updateOneSauce = (req, res, next) => {
    console.log("------------------------------UPDATE SAUCE---------------------------")
    console.log({ _id: req.params.id })
    console.log(req.body)
    // Affichage de l'userid authentifié de la requête
    console.log("req.auth.userId", req.auth.userId);
    console.log("req.body.userId", req.body.userId);
    console.log("req.file")
    console.log(req.file)

    //Si l'userid de l'utilisateur actuel est le même que celui de l'authentification
    if (req.auth.userId === req.body.userId) {
        console.log("UserID-auth === userId-body")

        // Si un fichier image est présent
        if (req.file) {
            sauce.findOne({ _id: req.params.id })
                .then((objet) => {
                    console.log("objet")
                    console.log(objet)

                    // Récupération du nom du fichier à supprimer avant l'ajout du nouveau
                    const filename = objet.imageUrl.split("/images")[1]
                    console.log("filename")
                    console.log(filename)

                    //Suppression de l'image initiale
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) throw error
                    })




                })
                .catch(error => res.status(400).json({ error }))
        } else {
            console.log("false")
        }

        // Modification de l'image qui sera envoyée dans la base de donnée
        console.log("req.body")
        console.log(req.body)

        console.log("req.body.sauce")
        console.log(req.body.sauce)

        // Deux cas possibles
        const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            } : {
                ...req.body
            }
        console.log("sauceObject")
        console.log(sauceObject)

        //Mise à jour de la base de donnée
        saucesModel.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'sauce modifiée', posted: req.body }))
            .catch(error => res.status(404).json({ error }))
    }
    //Si l'userid de l'utilisateur actuel est différent de celui de l'authentification
    else {
        console.log("error userId invalide")
        res.status(400).json({ message: 'userId invalide' })
    }

    next
}

// Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
    console.log("------------------------------DELETE SAUCE--------------------------")
    console.log(req.body)
    console.log("req.auth.userId", req.auth.userId)

    console.log("req.body.userId", req.body.userId)

    sauce.findOne({ _id: req.params.id })
        .then((objet) => {
            console.log("objet")
            console.log(objet)

            //Si l'userid de l'utilisateur actuel est le même que celui de l'authentification            
            if (req.auth.userId === objet.userId) {
                // Récupération du nom du fichier à supprimer avant l'ajout du nouveau
                const filename = objet.imageUrl.split("/images")[1]
                console.log("filename")
                console.log(filename)

                //Suppression de l'image initiale
                fs.unlink(`images/${filename}`, () => {
                    saucesModel.deleteOne({ _id: req.params.id })
                        .then(res.status(200).json({ message: "sauce effacée" }))
                        .catch(error => res.status(404).json({ error }))
                })
                //Si l'userid de l'utilisateur actuel est différent de celui de l'authentification
            } else {
                console.log("error userId invalide")
                res.status(400).json({ message: 'userId invalide' })
            }
        })

        .catch((error => res.status(404).json({ error })))


}







