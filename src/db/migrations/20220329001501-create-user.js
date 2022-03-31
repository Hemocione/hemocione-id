'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        // defaultValue: Sequelize.literal( 'uuid_generate_v4()'),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      givenName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      surName: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      bloodType: {
        allowNull: false,
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
      },
      birthDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      emailVerified: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      document: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('M', 'F', 'O')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isAdmin: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};