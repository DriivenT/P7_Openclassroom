const express = require('express');
const helmet = require('helmet');
// const bodyParser = require('body-parser');
const mysql = require('mysql');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const routeAuthentification = require('./routes/authentificationRouter');
const routePost = require('./routes/postRouter');
const routeCommentaire = require('./routes/commentaireRouter');

/*const connexionBDD = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

connexionBDD.connect(function (error) {
    if (error) throw error;
    console.log("Connecté !");
});*/

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: process.env.PORT
})
try {
    sequelize.authenticate();
    console.log('Connexion Sequelize réussie !')
}
catch (error) {
    console.log('Impossible de ce connecter: ' + error);
}

const app = express();

// Autorisation des headers
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', process.env.HEADERS);
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Parse request.body en JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sécurise les headers
app.use(helmet());

// Routes
app.use('/api/users', routeAuthentification);
app.use('/api/posts', routePost);
app.use('/api', routeCommentaire);

module.exports = app;