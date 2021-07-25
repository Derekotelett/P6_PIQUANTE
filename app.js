const express = require('express'); //importation du package express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('x-xss-protection');
const path = require('path');
require('dotenv').config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER_DB}.hqzak.mongodb.net/${process.env.DATA_BASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express(); //permet de créer une application express

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());//transforme le corps des requêtes en objet json utilisable
  
  app.use(express({limit: '10kb'}));

  app.use(helmet());

  app.use(mongoSanitize());

  app.use(xss());

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/api/sauces', sauceRoutes);

  app.use('/api/auth', userRoutes);

module.exports = app; // on exporte notre application express pour que le serveur y accède

/*const express = require('express');
const app = express();
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});
app.use((req, res, next) => {
  res.status(201);
  next();
});
app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});
app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});
module.exports = app;*/