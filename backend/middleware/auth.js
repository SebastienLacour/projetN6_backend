const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {

        //Récupération du token
        // La constante token réqupère uniquement le token de la requête
        const token = req.headers.authorization.split(" ")[1]
        console.log("-------------------------AUTHENTIFICATION-------------------------")
        console.log("token")
        console.log(token)

        //décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_ACCESS')
        console.log("decodedToken")
        console.log(decodedToken)
        //Récupération de l'id du token et le comparer avec l'id en clair
        const userId = decodedToken.userId

        req.auth = {
            userId: userId
        };
        
        console.log(req.body);

        next()

    } catch (error) {
        res.status(403).json({ error}); 
    } 
};