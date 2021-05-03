// Imports
const models = require('../models');
const getUserId = require('../utils/getUserIdUtils');

regexContenu = /^([1-zA-Z0-1@.\s]{1,255})$/;

// Controllers
exports.trouverTousCommentaires = (request, response, next) => {

    let postId = request.url.split('/')[2];

    models.Commentaire.findAll({
        where: { idPosts: postId }
    })
        .then(commentaires => {
            if (commentaires) {
                response.status(200).json(commentaires);
            } else {
                response.status(404).json({ error: "Pas de message trouvé." });
            }
        })
        .catch(() => {
            response.status(500).json({ error: "Champ invalide." });
        });
}

exports.creerCommentaire = (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let contenu = request.body.contenu;
    let postId = request.url.split('/')[2];

    if (contenu === null) {
        return response.status(400).json({ error: 'Erreur, votre commentaire est vide.' });
    }
    else if (contenu.length == null || contenu.length > 255) {
        return response.status(400).json({ error: 'Erreur, votre commentaire doit contenir entre 1 et 255 caractères.' });
    }

    models.Utilisateur.findOne({
        where: { id: userId }
    })
        .then(utilisateurTrouve => {
            if (utilisateurTrouve) {
                if (regexContenu.test(contenu)) {
                    models.Commentaire.create({
                        contenu: contenu,
                        idUtilisateurs: utilisateurTrouve.id,
                        idPosts: postId
                    })
                        .then(nouveauCommentaire => {
                            return response.status(201).json({ nouveauCommentaire });
                        })
                        .catch((err) => response.status(400).json({ error: 'Erreur, le commentaire n\'a pas pu être créé ' + err }));
                }
                else {
                    return response.status(400).json({ error: 'Erreur, votre commentaire contient des caractères interdits.' });
                }
            }
            else {
                return response.status(400).json({ error: 'Utilisateur inconnu.' })
            }
        })
        .catch(() => response.status(404).json({ error: 'Utilisateur introuvable.' }));
}

exports.modifierCommentaire = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let commentaireId = request.url.split('/')[2];

    // On cherche l'id et le contenu du commentaire a modifier
    let commentaire = await models.Commentaire.findOne({
        attributes: ['id', 'contenu', 'idUtilisateurs'],
        where: { id: commentaireId }
    })
    .then(commentaireTrouve => {
        if (commentaireTrouve != null) {
            return commentaireTrouve;
        }
        else {
            return response.status(400).json({ error: 'Commentaire inconnu.' })
        }
    })
    .catch(() => response.status(404).json({ error: 'Commentaire introuvable.' }))

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

    if (commentaire.idUtilisateurs == utilisateur.id) {
        await models.Commentaire.update({
            contenu: (commentaire.contenu != request.body.contenu ? request.body.contenu : commentaire.contenu)
        },
            {
                where: { id: commentaireId }
            })
            .then(updatedContenu => {
                console.log(updatedContenu);
                response.status(202).json(updatedContenu);
            })
            .catch(() => response.status(400).json({ error: 'Le contenu n\'a pas pu être mis à jour. ' }))
    }
    else {
        return response.status(401).json({ error: 'Ce commentaire ne vous appartient pas, vous n\'êtes pas autorisé à le modifier.' })
    }
}

exports.supprimerCommentaire = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let commentaireId = request.url.split('/')[2];

    // On cherche l'id et le contenu du commentaire a modifier
    let commentaire = await models.Commentaire.findOne({
        attributes: ['id', 'idUtilisateurs'],
        where: { id: commentaireId }
    })
        .then(commentaireTrouve => {
            if (commentaireTrouve != null) {
                return commentaireTrouve;
            }
            else {
                return response.status(400).json({ error: 'Commentaire inconnu.' })
            }
        })
        .catch(() => response.status(404).json({ error: 'Commentaire introuvable.' }))

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

    if (commentaire.idUtilisateurs == utilisateur.id) {
        await models.Commentaire.destroy({
            where: { id: commentaireId }
        })
            .then(() => response.status(202).json('La suppression du commentaire a été prise en compte.'))
            .catch(() => response.status(404).json({ error: 'Echec de la suppression.' }))
    }
    else {
        return response.status(401).json({ error: 'Vous n\'avez pas l\'autorisation pour faire cela.' })
    }
}

exports.likeCommentaire = async (request, response, next) => {

    let headerAutorisation = request.headers.authorization;
    let userId = getUserId(headerAutorisation);
    let commentaireId = request.url.split('/')[2];

    // Je cherche le commentaire qui appartient a l'id passer en url, avec son nombre de like et le json contenu les id's des gens qui ont déjà like.
    models.Commentaire.findOne({
        attributes: ['id', 'likes', 'usersLiked'],
        where: { id: commentaireId }
    })
    .then(commentaireTrouve => {
        // Si ma colonne usersLiked est vide, je passe au else, sinon
        if (commentaireTrouve.usersLiked != null) {
            // Je stocke le JSON qui est dans ma base de donnée, dans une variable, qui va donc contenir un objet
            let userIdArray = JSON.parse(commentaireTrouve.usersLiked)

            // Je cherche a savoir si l'id de l'utilisateur qui essaye de like est déjà dans le tableau "userId"
            // Si c'est le cas, je retire son like ainsi que son id du tableau et j'update la bdd en reconvertissant en JSON l'objet.
            if (userIdArray.userId.includes(userId)) {
                const index = userIdArray.userId.indexOf(userId);
                userIdArray.userId.splice(index, 1);
                commentaireTrouve.likes = commentaireTrouve.likes - 1;

                models.Commentaire.update({
                    usersLiked: JSON.stringify(userIdArray),
                    likes: commentaireTrouve.likes
                },
                {
                    where: { id: commentaireId }
                })
                .then(() => response.status(202).json('Votre like à été retiré.'))
                .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été retiré.' + err }))
            }
            // Sinon, j'ajoute son id dans le tableau, et incrémente le nombre de like, puis je fais l'update en repassant mon objet en JSON.
            else {
                userIdArray.userId.push(userId);
                commentaireTrouve.likes = commentaireTrouve.likes + 1;

                models.Commentaire.update({
                    usersLiked: JSON.stringify(userIdArray),
                    likes: commentaireTrouve.likes
                },
                {
                    where: { id: commentaireId }
                })
                .then(() => response.status(202).json('Votre like à été accepté.'))
                .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été pris en compte.' + err }))
                }
            }
        // La colonne est vide, donc je la rempli.
        else {
            // Je créé un objet, qui sera converti en JSON pour être stocker dans ma bdd, avec l'id de l'utilisateur qui a like en premier a l'intérieur
            // et j'incrémente le nombre de like.
            let userWhoLiked = { "userId": [userId] };
            let totalLikes = commentaireTrouve.likes + 1;

            models.Commentaire.update({
                usersLiked: JSON.stringify(userWhoLiked),
                likes: totalLikes
            },
            {
                where: { id: commentaireId }
            })
            .then(() => response.status(202).json('Votre like à été accepté.'))
            .catch((err) => response.status(404).json({ error: 'Echec, votre like n\'a pas été pris en compte.' + err }))
        }
    })
    .catch((err) => response.status(404).json({ error: 'Commentaire introuvable.' + err }))
}