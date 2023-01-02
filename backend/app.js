//Importation de express
const express = require('express');

//Importation de mongoose
const mongoose = require('mongoose');

//Importation de morgan
const morgan = require('morgan')

const saucesModel = require('./models/sauce');

//importation des routes
const userRoutes = require('./route/user');
const sauceRoutes = require('./route/sauce');
const path = require('path');
const { use } = require('./route/sauce');



mongoose.connect('mongodb+srv://sebastien:arakno1@cluster0.xgf5ncl.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();


app.use(express.json())

//logger les req et res
app.use(morgan("dev"))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))



module.exports = app;