'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.Post.belongsTo(models.Utilisateur, {
        foreignKey: {
          name: "idUtilisateurs"
        },
      }),
      models.Post.hasMany(models.Commentaire, {
        foreignKey: {
          name: "idPosts"
        }
      })
    }
  };
  Post.init({
    idUtilisateurs: DataTypes.INTEGER,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    contenu: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    usersLiked: DataTypes.TEXT
  }, { sequelize, modelName: 'Post',}
  );
  return Post;
};