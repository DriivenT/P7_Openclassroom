const express = require('express');
const router = express.Router();

const controleCommentaire = require('../controllers/controleCommentaire');
const autorisation = require('../middlewares/autorisation');

router.get('/post/:id/commentaires', autorisation, controleCommentaire.trouverTousCommentaires); // Trouver tous les commentaire
router.post('/post/:id/commentaires', autorisation, controleCommentaire.creerCommentaire); // Créer un commentaire
router.put('/commentaires/:id', autorisation, controleCommentaire.modifierCommentaire); // Modifier un commentaire
router.delete('/commentaires/:id', autorisation, controleCommentaire.supprimerCommentaire); // Supprimer un commentaire
router.post('/commentaires/:id/like', autorisation, controleCommentaire.likeCommentaire); // Ajouter un like sur un commentaire

module.exports = router;