'use strict';
const {
  Model
} = require('sequelize');

const { validateCPF } = require('../../utils/cpf')

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  user.init({
    givenName: DataTypes.STRING,
    surName: DataTypes.STRING,
    image: DataTypes.STRING,
    bloodType: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    birthDate: DataTypes.DATE,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email inválido.'
        }
      },
      unique: {
        args: true,
        msg: 'Email já cadastrado.'
      },
      allowNull: false
    },
    emailVerified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    document: {
      type: DataTypes.STRING,
      validate: {
        isValidCPF (value) {
          if (!validateCPF(value)) {
            throw new Error('CPF inválido.')
          }
        }
      },
      unique: {
        args: true,
        msg: 'CPF já cadastrado.'
      },
      allowNull: false,
    },
    phone: DataTypes.STRING,
    gender: DataTypes.ENUM('M', 'F', 'O'),
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};