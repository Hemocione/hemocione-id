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
    return createdUser
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(e.errors.map((error) => error.message).join(', '));
    }
    throw e;
  }
}

const validateUserTokenData = async (userData) => {
  const user = await user.findOne({ where: { id: userData.id, isAdmin: userData.mainRole === 'admin' } });
  if (!user) {
    throw new InvalidTokenData();
  }
}

const login = async (email, password) => {
  const user = await user.findOne({ where: { email } });
  if (!user) {
    throw new UserNotFoundError();
  }
  if (!await compareHashPassword(password, user.password)) {
    throw new InvalidPasswordError();
  }
  return user;
}

module.exports = { register, login, validateUserTokenData };
