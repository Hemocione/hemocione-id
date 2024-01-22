"use strict";
const { Model } = require("sequelize");

const { validateCPF } = require("../../utils/cpf");
const { selectObjKeys } = require("../../utils/selectObjKeys");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    publicFields = [
      "id",
      "givenName",
      "surName",
      "phone",
      "bloodType",
      "birthDate",
      "email",
      "gender",
      "isAdmin",
    ];

    static associate(models) {
      this.hasMany(models.userAddress, { as: "addresses" });
      this.hasMany(models.userDonation, { as: "donations" });
    }

    publicDataValues() {
      return selectObjKeys(this.dataValues, this.publicFields());
    }
  }

  user.init(
    {
      givenName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "O nome não pode ser vazio",
          },
          notNull: {
            msg: "O nome não pode ser vazio",
          },
        },
        allowNull: false,
      },
      surName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "O sobrenome não pode ser vazio",
          },
          notNull: {
            msg: "O sobrenome não pode ser vazio",
          },
        },
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodType: {
        type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
        validate: {
          isIn: {
            args: [["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]],
            msg: "Tipo sanguíneo inválido",
          },
        },
        notNull: {
          msg: "Tipo sanguíneo não pode ser vazio",
        },
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: "Data de nascimento inválida",
          },
          notEmpty: {
            msg: "Data de nascimento não pode ser vazia",
          },
          notNull: {
            msg: "Data de nascimento não pode ser vazia",
          },
        },
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: "Email inválido",
          },
        },
        unique: {
          args: true,
          msg: "Email já cadastrado",
        },
        notNull: {
          msg: "Email não pode ser vazio",
        },
        allowNull: false,
      },
      emailVerified: DataTypes.BOOLEAN,
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Senha não pode ser vazia",
          },
          notNull: {
            msg: "Senha não pode ser vazia",
          },
        },
        allowNull: false,
      },
      document: {
        type: DataTypes.STRING,
        validate: {
          isValidCPF(value) {
            if (value && !validateCPF(value)) {
              throw new Error("CPF inválido");
            }
          },
        },
        unique: {
          args: true,
          msg: "CPF já cadastrado",
        },
        allowNull: true,
      },
      phone: DataTypes.STRING,
      gender: {
        type: DataTypes.ENUM("M", "F", "O"),
        validate: {
          isIn: {
            args: [["M", "F", "O"]],
            msg: "Gênero precisa ser do tipo [M, F, O]",
          },
          notNull: {
            msg: "Gênero precisa ser do tipo [M, F, O]",
          },
        },
        allowNull: false,
      },
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        beforeSave: (user, options) => {
          const userRawDocument = user.document?.trim();
          if (userRawDocument)
            user.document = userRawDocument.replace(/[^0-9]/g, "");
          if (userRawDocument === "") user.document = null;
        },
      },
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
