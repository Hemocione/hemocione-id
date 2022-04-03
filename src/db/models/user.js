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
    givenName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'O nome não pode ser vazio.'
        }
      }
    },
    surName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'O sobrenome não pode ser vazio.'
        }
      }
    },
    image: { 
      type: DataTypes.STRING,
      allowNull: true
    },
    bloodType: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
      validate: {
        isIn: {
          args: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']],
        },
      allowNull: false
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
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
    password: { 
      type: DataTypes.STRING,
      allowNull: false
    },
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
    gender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      validate: {
        isIn: [['M', 'F', 'O']]
      },
    },
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};