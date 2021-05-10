'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    static associate(models) {
      models.Commentaire.belongsTo(models.Post, {
        foreignKey: {
          name: "idPosts"
        }
      }),
      models.Commentaire.belongsTo(models.Utilisateur, {
        foreignKey: {
          name: "idUtilisateurs"
        }
      })
    }
  };
  Commentaire.init({
    idUtilisateurs: DataTypes.INTEGER,
    idPosts: DataTypes.INTEGER,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    contenu: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    usersLiked: DataTypes.TEXT
  }, { sequelize, modelName: 'Commentaire', }
  );
  return Commentaire;
};