"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "users_document_key");
    await queryInterface.removeIndex("users", "users_document_key");
    await queryInterface.removeConstraint("users", "users_document_key1");
    await queryInterface.removeIndex("users", "users_document_key1");
  },

  async down(queryInterface, Sequelize) {
    console.log("This migration is irreversible.");
  },
};
