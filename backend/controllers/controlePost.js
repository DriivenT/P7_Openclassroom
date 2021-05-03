// Imports
const models = require('../models');
const post = require('../models/post');
const getUserId = require('../utils/getUserIdUtils');

regexContenu = /^([1-zA-Z0-1@.\s]{1,255})$/;

// Controllers
exports.trouverTousPosts = (request, response, next) => {

    models.Post.findAll({
    })
        .then(posts => {
            if (posts) {
                response.status(200).json(posts);
            } else {
                response.status(404).json({ error: "Pas de message trouvé." });
            }
        })
        .catch(() => response.status(500).json({ error: "Champ invalide."}));
}

exports.creerPost = (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let contenu = request.body.contenu;

    if(contenu === null){
        return response.status(400).json({ error: 'Erreur, votre post est vide.' });
    }
    else if (contenu.length < 5 || contenu.length > 255){
        return response.status(400).json({ error: 'Erreur, votre post doit contenir entre 5 et 255 caractères.' });
    }

    models.Utilisateur.findOne({
        where: { id: userId }
    })
    .then(utilisateurTrouve => {
        if(utilisateurTrouve){
            if (regexContenu.test(contenu)) {
                models.Post.create({
                    contenu: contenu,
                    idUtilisateurs: utilisateurTrouve.id
                })
                    .then(nouveauPost => {
                        return response.status(201).json({ nouveauPost });
                    })
                    .catch(err => response.status(400).json({ error: 'Erreur, le post n\'a pas pu être créé: ' + err }));
            }
            else {
                return response.status(400).json({ error: 'Erreur, votre post contient des caractères interdits.' });
            }
        }
        else{
            return response.status(400).json({ error: 'Utilisateur inconnu.' })
        }
    })
    .catch(() => response.status(404).json({ error: 'Utilisateur introuvable.' }));
}

exports.modifierPost = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let postId = request.url.split('/')[1];

    // On cherche le contenu du post a modifier grâce a son id
    let post = await models.Post.findOne({
        attributes: ['id', 'contenu', 'idUtilisateurs'],
        where: { id: postId }
    })
    .then(postTrouve => {
        if(postTrouve != null){
            return postTrouve;
        }
        else{
            return response.status(400).json({ error: 'Post inconnu.' })
        }
    })
    .catch(() => response.status(404).json({ error: 'Post introuvable.'}))

    // On cherche l'id de l'utilisateur
    let utilisateur = await models.Utilisateur.findOne({
        attributes: ['id'],
        where: { id: userId }
    })
    .then(utilisateurTrouve => {
        if(utilisateurTrouve != null){
            return utilisateurTrouve;
        }
        else{
            return response.status(400).json({ error: 'Utilisateur inconnu.'})
        }
    })
    .catch(() => response.status(404).json({ error: 'Utilisateur introuvable.'}))

    if(post.idUtilisateurs == utilisateur.id){
        await models.Post.update({
            contenu: (post.contenu != request.body.contenu ? request.body.contenu : post.contenu)},
            { where: {id: postId}
        })
        .then(updatedContenu => {
            console.log(updatedContenu);
            response.status(202).json(updatedContenu);
        })
        .catch(() => response.status(400).json({ error: 'Le contenu n\'a pas pu être mis à jour. ' }))
    }
    else{
        return response.status(401).json({ error: 'Ce post ne vous appartient pas, vous n\'êtes pas autorisé à le modifier.' })
    }
}

exports.supprimerPost = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let postId = request.url.split('/')[1];

    // On cherche le post a supprimer grâce a son id
    let post = await models.Post.findOne({
        attributes: ['id', 'idUtilisateurs'],
        where: { id: postId }
    })
    .then(postTrouve => {
        if (postTrouve != null) {
            return postTrouve;
        }
        else {
            return response.status(400).json({ error: 'Post inconnu.' })
        }
    })
    .catch(() => response.status(404).json({ error: 'Post introuvable.' }))

    // On cherche l'id de l'utilisateur
    let utilisateur = await models.Utilisateur.findOne({
        attributes: ['id'],
        where: { id: userId }
    })
    .then(utilisateurTrouve => {
        if (utilisateurTrouve != null) {
            return utilisateurTrouve;
        }
        else {
            return response.status(400).json({ error: 'Utilisateur inconnu.' })
        }
    })
    .catch(() => response.status(404).json({ error: 'Utilisateur introuvable.' }))

    if (post.idUtilisateurs == utilisateur.id) {

        await models.Commentaire.destroy({
            where: { id: postId }
        })
        
        await models.Post.destroy({
            where: { id: postId }
        })
        .then(() => response.status(202).json('La suppression du post a été prise en compte.'))
        .catch(() => response.status(404).json({ error: 'Echec de la suppression.' }))
    }
    else {
        return response.status(401).json({ error: 'Vous n\'avez pas l\'autorisation pour faire cela.' })
    }
}

exports.likePost = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let postId = request.url.split('/')[1];

    // Je cherche le post qui appartient a l'id passer en url, avec son nombre de like et le json contenu les id's des gens qui ont déjà like.
    models.Post.findOne({
        attributes: ['id', 'likes', 'usersLiked'],
        where: { id: postId }
    })
    .then(postTrouve => {
        // Si ma colonne usersLiked est vide, je passe au else, sinon
        if(postTrouve.usersLiked != null){
            // Je stocke le JSON qui est dans ma base de donnée, dans une variable, qui va donc contenir un objet
            let userIdArray = JSON.parse(postTrouve.usersLiked)

            // Je cherche a savoir si l'id de l'utilisateur qui essaye de like est déjà dans le tableau "userId"
            // Si c'est le cas, je retire son like ainsi que son id du tableau et j'update la bdd en reconvertissant en JSON l'objet.
            if(userIdArray.userId.includes(userId)){
                const index = userIdArray.userId.indexOf(userId);
                userIdArray.userId.splice(index, 1);
                postTrouve.likes = postTrouve.likes - 1;

                models.Post.update({
                    usersLiked: JSON.stringify(userIdArray),
                    likes: postTrouve.likes 
                },
                {
                    where: { id: postId }
                })
                .then(() => response.status(202).json('Votre like à été retiré.'))
                .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été retiré.' + err }))
            }
            // Sinon, j'ajoute son id dans le tableau, et incrémente le nombre de like, puis je fais l'update en repassant mon objet en JSON.
            else{
                userIdArray.userId.push(userId);
                postTrouve.likes = postTrouve.likes + 1;

                models.Post.update({
                    usersLiked: JSON.stringify(userIdArray),
                    likes: postTrouve.likes
                },
                {
                    where: { id: postId }
                })
                .then(() => response.status(202).json('Votre like à été accepté.'))
                .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été pris en compte.' + err }))
            }
        }
        // La colonne est vide, donc je la rempli.
        else{
            // Je créé un objet, qui sera converti en JSON pour être stocker dans ma bdd, avec l'id de l'utilisateur qui a like en premier a l'intérieur
            // et j'incrémente le nombre de like.
            let userWhoLiked = { "userId": [userId] };
            let totalLikes = postTrouve.likes + 1;

            models.Post.update({
                usersLiked: JSON.stringify(userWhoLiked),
                likes: totalLikes
            },
            {
                where: { id: postId }
            })
            .then(() => response.status(202).json( 'Votre like à été accepté.' ))
            .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été pris en compte.' + err}))
        }
    })
    .catch((err) => response.status(404).json({ error: 'Post introuvable.' +err}))

}