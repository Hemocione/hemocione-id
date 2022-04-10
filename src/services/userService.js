const { user } = require('../db/models');
const { generateHashPassword, compareHashPassword } = require('../utils/hash');
const { selectObjKeys } = require('../utils/selectObjKeys'); 
const { UserNotFoundError, InvalidPasswordError, InvalidUserParamsError, InvalidTokenData } = require("../errors/authErrors");
const { ValidationError } = require('sequelize');

const register = async (userData) => {
  // not using image for now
  const desiredKeys = ['givenName', 'surName', 'document', 'phone', 'bloodType', 'birthDate', 'email', 'password', 'gender']
  const filteredUserParams = selectObjKeys(userData, desiredKeys)
  try {
    const createdUser = await user.create({
      ...filteredUserParams,
      password: await generateHashPassword(filteredUserParams.password)
    });
    return createdUser.publicDataValues();
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(e.errors.map((error) => error.message).join(', '));
    }
    throw e;
  }
}

const findUserFromTokenData = async (tokenUserData) => {
  const foundUser = await user.findOne({ where: { id: tokenUserData.id, email: tokenUserData.email, bloodType: tokenUserData.bloodType, givenName: tokenUserData.givenName }})
  if (!foundUser) {
    throw new InvalidTokenData();
  }
  return foundUser.publicDataValues()
}

const login = async (email, password) => {
  const loggedInUser = await user.findOne({ where: { email } });
  if (!loggedInUser) {
    throw new UserNotFoundError();
  }
  if (!await compareHashPassword(password, loggedInUser.password)) {
    throw new InvalidPasswordError();
  }
  return loggedInUser.publicDataValues();
}

module.exports = { register, login, findUserFromTokenData };
