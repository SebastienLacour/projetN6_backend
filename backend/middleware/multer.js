// importation de multer pour gérer les requetes http pour l'envoie de fichier, notamment d'images
const multer = require("multer");

//Le dictionnaire des MIME TYPES
const MIME_TYPE = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpg",
    "image/png" : "png"
};


//Destination du fichier et générer un nom de fichier unique
const storage = multer.diskStorage({

    // là où sera stocké le fichier 
    destination: (req, file, callback) => {
        callback(null, "images");
    },

    //Le nom du fichier
    filename: (req, file, callback) => {
        //Suprimer les espaces dans le nom du fichier et les remplacer par des "_ "
        const name = file.originalname.split(" ").join("_")
        const extension = MIME_TYPE[file.mimetype];
        
        callback(null, name + "_" + Date.now() + "." + extension);
    }

})

//Exportations du module
module.exports = multer({storage}).single("image"); 