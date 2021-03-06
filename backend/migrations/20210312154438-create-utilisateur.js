'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Utilisateurs', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nom: {
        allowNull: false,
        type: Sequelize.STRING
      },

      prenom: {
        allowNull: false,
        type: Sequelize.STRING
      },

      email: {
        allowNull: false,
        type: Sequelize.STRING
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING
      },

      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Utilisateurs');
  }
};