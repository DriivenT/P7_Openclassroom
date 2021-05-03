// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models')
require('dotenv').config();
const getUserId = require('../utils/getUserIdUtils');

const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/;

exports.inscription = async (request, response, next) => {

    let nom = request.body.nom;
    let prenom = request.body.prenom;
    let email = request.body.email;
    let password = request.body.password;

    // Vérifie que les inputs ne sont pas vides
    if (nom == null || prenom == null || email == null || password == null){
        return response.status(400).json({ error: 'Il manque des informations.' });
    }

    // Vérification des inputs
    if(nom.length < 2 || nom.length > 32){
        return response.status(400).json({ error: 'Erreur, entre 2 et 32 caractères nécessaire.' });
    }

    if(prenom.length < 2 || prenom.length > 32){
        return response.status(400).json({ error: 'Erreur, entre 2 et 32 caractères nécessaire.' });
    }
    
    if(!regexEmail.test(email)){
        return response.status(400).json({ error: 'Email invalide.' });
    }

    if(!regexPassword.test(password)){
        return response.status(400).json({ error: 'Mot de passe invalide. (Entre 4 et 20 caractères, une majuscule, une minuscule et un chiffre obligatoire.' });
    }

    // Vérifie la validité de l'adresse mail
    await models.Utilisateur.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    // Si l'email n'est pas déjà utilisée, on crée un nouveau utilisateur
    .then(utilisateurTrouve => {
        if (utilisateurTrouve === null) {
            bcrypt.hash(password, 10)
                .then(hash => {
                    models.Utilisateur.create({
                        nom: nom,
                        prenom: prenom,
                        email: email,
                        password: hash
                    })
                        .then(nouveauUtilisateur => {
                            return response.status(201).json({ 'idUtilisateur': nouveauUtilisateur.id })
                        })
                        .catch(() => { response.status(500).json({ error: 'Impossible de créer l\'utilisateur.' }) })
                })
                .catch(() => { response.status(500).json({ error: 'L\'utilisateur n\'a pas pu être créé.' }) })
        }
        // Sinon, erreur.
        else {
            return response.status(409).json({ error: 'L\'utilisateur existe déjà.' })
        }
    })
    .catch(() => { response.status(400).json({ error: 'Une erreur est survenue.'})} )
}

exports.connexion = async (request, response, next) => {

    let email = request.body.email;
    let password = request.body.password;

    // Vérifie que les inputs ne sont pas vides
    if (email == null || password == null) {
        return response.status(400).json({ error: 'Il manque des informations.' });
    }

    // Cherche une adresse mail correspondant a celle entrée.
    models.Utilisateur.findOne({
        where: { email: email }
    })
    // Si on trouve, connexion
    .then(utilisateurTrouve => {
        if (utilisateurTrouve != null) {
            bcrypt.compare(password, utilisateurTrouve.password)
                .then(valid => {
                    if (!valid) {
                        return response.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    else {
                        return response.status(202).json({
                            userId: utilisateurTrouve.id,
                            token: jwt.sign(
                                { userId: utilisateurTrouve.id },
                                process.env.TOKEN_SECRET,
                                { expiresIn: '24h' }
                            )
                        });
                    }
                })
                .catch(() => response.status(500).json({ error: 'Echec de la connexion' }));
        }
        // Sinon, l'utilisateur n'existe pas
        else {
            return response.status(400).json({ error: 'L\'utilisateur n\'existe pas.' });
        }
    })
    .catch(() => response.status(500).json({ error: 'Echec, demande interrompu'}));
};

exports.modifierEmail = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);

    models.Utilisateur.findOne({
        attributes: ['id', 'email'],
        where: { id: userId }
    })
    .then(utilisateurTrouve => {
        newEmail = request.body.email;
        if (!regexEmail.test(newEmail)) {
            return response.status(400).json({ error: 'Email invalide.' });
        }
        else{
            models.Utilisateur.update({
                email: newEmail },
                { where: { id: userId }
            })
            .then(() => response.status(202).json('La modification à été effectuée.'))
            .catch(() => response.status(400).json({ error: 'Echec l\'utilisateur n\'a pas été mis à jour.'}))
        }
    })
    .catch((err) => response.status(404).json({ error: "Utilisateur introuvable." + err}))
}

exports.profilUtilisateur = (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);

    if(userId === null){
        return response.status(400).json({ error: 'Mauvais token.'});
    }

    models.Utilisateur.findOne({
        attributes: ['id', 'nom', 'prenom', 'email' ],
        where: { id: userId }
    })
    .then(utilisateur => {
        if(utilisateur){
            response.status(202).json(utilisateur);
        }
        else{
            response.status(404).json({ error: 'Utilisateur non trouvé.'});
        }
    })
    .catch(() => response.status(500).json({ error: 'Impossible de trouver l\'utilisateur.' }));
};

exports.supprimerUtilisateur = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);

    await models.Commentaire.destroy({
        where: { idUtilisateurs: userId }
    })

    await models.Post.destroy({
        where: { idUtilisateurs: userId }
    })

    await models.Utilisateur.destroy({
        where: { id: userId }
    })
    .then(() => response.status(202).json('Utilisateur, Posts et Commentaires supprimés avec succès ! '))
    .catch(() => response.status(400).json({ error: 'L\'utilisateur n\'a pas pu être supprimé. ' }))
}