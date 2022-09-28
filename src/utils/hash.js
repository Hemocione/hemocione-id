const bcrypt = require("bcrypt")

const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

const compareHashPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

module.exports = { generateHashPassword, compareHashPassword }
