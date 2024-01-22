"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class userDonation extends Model {
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.donationProvider);
    }
  }

  userDonation.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      donationProviderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "donationProviders",
          key: "id",
        },
      },
      donationProviderDonationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      donationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      modelName: "userDonation",
    }
  );

  return userDonation;
};
