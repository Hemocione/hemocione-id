"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userDonations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      donationProviderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "donationProviders",
          key: "id",
        },
      },
      donationProviderDonationId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      donationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userDonations");
  },
};
