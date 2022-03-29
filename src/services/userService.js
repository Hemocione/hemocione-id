const { user } = require('../db/models');
const { generateHashPassword, compareHashPassword } = require('../utils/hash');

const registerUser = async (userData) => {
  const desiredData = { givenName, surName, document, phone, bloodType, birthDate, email, password, gender, image }
  const filteredUserData = ((desiredData) => (desiredData))(userData);
  
  return await user.create({
    ...filteredUserData,
    password: await generateHashPassword(filteredUserData.password)
  })
}

const login = async (email, password) => {
  const user = await user.findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  if (!await compareHashPassword(password, user.password)) {
    throw new Error('Senha incorreta');
  }
  return user;
}

module.exports = { registerUser, login };
