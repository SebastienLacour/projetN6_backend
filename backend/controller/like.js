
// Importation du modèle de sauce
const saucesModel = require('../models/sauce')

// Fonction qui controlera les likes
exports.likeSauce = (req, res, next) => {
    console.log("---------------GESTION DES LIKES-----------------------------")

    // Affichage du corps de la requête
    console.log("req.body");
    console.log(req.body);

    // Affichage de l'userid authentifié de la requête
    console.log("req.auth.userId", req.auth.userId);

    // Affichage de l'état du like
    console.log("req.body.like");
    console.log(req.body.like);


    // Récupérer l'objet dans la base de donnée
    saucesModel.findOne({ _id: req.params.id })
        .then((objet) => {
            console.log("objet",objet);

            // Utilisation de la méthode includes() pour voir si l'userId est présent       
            // Le like est égale à 1
            if(!objet.usersLiked.includes(req.auth.userId) && !objet.usersDisliked.includes(req.auth.userId) && req.body.like === 1) {

                // Mise à jour de la base de données
                saucesModel.updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {likes: 1},
                        $push: {usersLiked: req.auth.userId}
                    }
                    
                )
                    .then(() => res.status(201).json({Message: "like +1"}))
                    .catch(((error => res.status(400).json({ error }))))
            
        }
       
            // Le like est égal à 0 (annulation du like)
            if(objet.usersLiked.includes(req.auth.userId) && !objet.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {

                 // Mise à jour de la base de données
                 saucesModel.updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {likes: -1},
                        $pull: {usersLiked: req.auth.userId}
                    }
                    
                )
                    .then(() => res.status(201).json({Message: "like 0"}))
                    .catch(((error => res.status(400).json({ error }))))
            }

            // Le dislike est égale à 1
            if(!objet.usersDisliked.includes(req.auth.userId) && !objet.usersLiked.includes(req.auth.userId) && req.body.like === -1) {
             // Mise à jour de la base de données
             saucesModel.updateOne(
                {_id: req.params.id},
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.auth.userId}
                }
                
            )
                .then(() => res.status(201).json({Message: "dislike +1"}))
                .catch(((error => res.status(400).json({ error }))))
        }


            // Le dislike est égale à 0 (annulation du dislike)
            if(objet.usersDisliked.includes(req.auth.userId) && !objet.usersLiked.includes(req.auth.userId) && req.body.like === 0) {

                // Mise à jour de la base de données
                saucesModel.updateOne(
                   {_id: req.params.id},
                   {
                       $inc: {dislikes: -1},
                       $pull: {usersDisliked: req.auth.userId}
                   }
                   
               )
                   .then(() => res.status(201).json({Message: "dislike 0"}))
                   .catch(((error => res.status(400).json({ error }))))
           }


        })
        .catch((error => res.status(400).json({ error })))


} 
