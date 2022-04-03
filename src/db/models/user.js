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
        },
        notNull: {
          msg: 'O nome não pode ser vazio.'
        }
      }
    },
    surName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'O sobrenome não pode ser vazio.'
        },
        notNull: {
          msg: 'O sobrenome não pode ser vazio.'
        },
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
          msg: 'Tipo sanguíneo inválido.'
        }
      },
      notNull: {
        msg: 'Tipo sanguíneo não pode ser vazio'
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Data de nascimento inválida'
        },
      },
      notEmpty: {
        msg: 'Data de nascimento não pode ser vazia'
      },
      notNull: {
        msg: 'Data de nascimento não pode ser vazia'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email inválido'
        }
      },
      unique: {
        args: true,
        msg: 'Email já cadastrado'
      },
      notNull: {
        msg: 'Email não pode ser vazio'
      }
    },
    emailVerified: DataTypes.BOOLEAN,
    password: { 
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 100],
          msg: 'Senha deve ter no mínimo 8 caracteres'
        },
        notNull: {
          msg: 'Senha não pode ser vazia'
        }
      },
      allowNull: false
    },
    document: {
      type: DataTypes.STRING,
      validate: {
        isValidCPF (value) {
          if (!validateCPF(value)) {
            throw new Error('CPF inválido')
          }
        }
      },
      unique: {
        args: true,
        msg: 'CPF já cadastrado.'
      },
      notNull: {
        msg: 'CPF não pode ser vazio'  
      }
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