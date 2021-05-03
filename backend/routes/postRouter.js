const express = require('express');
const router = express.Router();

const controlePost = require('../controllers/controlePost');
const autorisation = require('../middlewares/autorisation');

router.get('', autorisation, controlePost.trouverTousPosts); // Trouver tous les posts
router.post('', autorisation, controlePost.creerPost); // Créer un post
router.put('/:id', autorisation, controlePost.modifierPost); // Modifier un post
router.delete('/:id', autorisation, controlePost.supprimerPost); // Supprimer un post
router.post('/:id/like', autorisation, controlePost.likePost); // Ajouter un like sur un post

module.exports = router;