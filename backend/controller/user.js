// Importation de bcrypt pour hasher le mot de passe
const bcrypt = require('bcrypt');

// Importation de jsonwebtoken pour générer un token à l'utilisateur
const jwt = require('jsonwebtoken');

// Importation du model de la base de donnée pour l'authentification
const User = require('../models/user');

// Fonction qui va enregistrer le nouvel utilisateur dans la base de donnée
exports.signup = (req, res, next) => {
    console.log(req.body.email)
    console.log(req.body.password)

    //hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            // Donnée à envoyer dans la base de donnée
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log(user);

            // enregistrer dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }).send(console.log(error)));
    return;
    next()
}
// Fonction login pour se connecter
exports.login = (req, res, next) => {

    // Chercher dans la base de donnée si l'utilisateur est présent

    console.log(User);

    User.findOne({ email: req.body.email })

        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur inéxistant" })
            }

            // Controle de la validité du mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then((controlPassword) => {
                    console.log(controlPassword)

                    if (!controlPassword) {
                        return res.status(401).json({ error: "mot de passe incorrect" })
                    }

                    // Envoie dans la réponse l'id de l'utilisateur et le token d'identification
                    console.log(user._id)
                    res.status(202).json({
                        userId : user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            `RANDOM_TOKEN_ACCESS`,
                            {expiresIn: '24h'}
                        )
                    }); 
                })

                .catch(error => res.status(500).json({ error }))
            return
        })

        .catch(error => res.status(500).json({ error }))
    return
    next()
}

