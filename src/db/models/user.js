'use strict';
const {
  Model
} = require('sequelize');
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
    email: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    document: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.ENUM('M', 'F', 'O'),
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};