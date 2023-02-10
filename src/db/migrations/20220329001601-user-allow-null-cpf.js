"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "document", {
      allowNull: true,
      type: Sequelize.STRING,
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "document", {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    });
  },
};
