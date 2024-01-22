"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class donationProvider extends Model {
    static associate(models) {
      this.hasMany(models.userDonation, { as: "donations" });
    }
  }

  donationProvider.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      secret: {
        type: DataTypes.UUID,
        allowNull: false,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome não pode ser vazio",
          },
          notNull: {
            msg: "O nome não pode ser vazio",
          },
        },
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O logo não pode ser vazio",
          },
          notNull: {
            msg: "O logo não pode ser vazio",
          },
        },
      },
      config: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O config não pode ser vazio",
          },
          notNull: {
            msg: "O config não pode ser vazio",
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
    },
    {
      sequelize,
      modelName: "donationProvider",
    }
  );
  return donationProvider;
};
