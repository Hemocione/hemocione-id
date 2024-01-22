"use strict";
const { Model } = require("sequelize");

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
        type: DataTypes.DATE,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "userDonation",
    }
  );

  return userDonation;
};
