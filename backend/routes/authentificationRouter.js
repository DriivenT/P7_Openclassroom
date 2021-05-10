const express = require('express');
const router = express.Router();

const controleUtilisateur = require('../controllers/controleUtilisateur');
const limiteConnexion = require('../middlewares/limiteConnexion');
const autorisation = require('../middlewares/autorisation');

router.post('', controleUtilisateur.inscription);
router.post('/connexion', /*limiteConnexion,*/ controleUtilisateur.connexion);
router.put('/:id', controleUtilisateur.modifierEmail);
router.get('/:id', autorisation, controleUtilisateur.trouverUnUtilisateur);
router.get('', autorisation, controleUtilisateur.profilUtilisateur);
router.delete('', autorisation, controleUtilisateur.supprimerUtilisateur);

module.exports = router;