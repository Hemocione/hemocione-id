const { user } = require('../../db/models');
const { generateHashPassword, compareHashPassword } = require('../../utils/hash');
import { UserNotFoundError, InvalidPasswordError, UserRegistrationError } from "../../errors/AuthErrors";
const { ValidationError } = require('sequelize');

const register = async (userData) => {
  const desiredData = { givenName, surName, document, phone, bloodType, birthDate, email, password, gender, image }
  const filteredUserData = ((desiredData) => (desiredData))(userData);
  try {
    const createdUser = await user.create({
      ...filteredUserData,
      password: await generateHashPassword(filteredUserData.password)
    })
    return createdUser;
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new UserRegistrationError(e.errors[0].message);
    }
    throw e;
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

module.exports = { registerUser, login };
