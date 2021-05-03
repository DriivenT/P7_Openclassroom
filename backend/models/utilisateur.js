'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      models.Utilisateur.hasMany(models.Post, {
        foreignKey: {
          name: "idUtilisateurs"
        }
      }),
      models.Utilisateur.hasMany(models.Commentaire, {
        foreignKey: {
          name: "idUtilisateurs"
        }
      })
    }
  };
  Utilisateur.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, { sequelize, modelName: 'Utilisateur',}
  );
  return Utilisateur;
};