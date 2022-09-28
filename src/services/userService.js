const { user } = require('../db/models')
const { generateHashPassword, compareHashPassword } = require('../utils/hash')
const { selectObjKeys } = require('../utils/selectObjKeys')
const { UserNotFoundError, InvalidPasswordError, InvalidUserParamsError, InvalidTokenData } = require("../errors/authErrors")
const { ValidationError } = require('sequelize')
const { sgMail } = require('@sendgrid/mail')
const { CustomAPIError } = require('../errors/customAPIError')

const register = async (userData) => {
  // not using image for now
  const desiredKeys = ['givenName', 'surName', 'document', 'phone', 'bloodType', 'birthDate', 'email', 'password', 'gender']
  const filteredUserParams = selectObjKeys(userData, desiredKeys)
  try {
    const createdUser = await user.create({
      ...filteredUserParams,
      password: await generateHashPassword(filteredUserParams.password)
    })
    return createdUser.publicDataValues()
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(e.errors.map((error) => error.message).join(', '))
    }
    throw e
  }
}

const login = async (email, password) => {
  const loggedInUser = await user.findOne({ where: { email } })
  if (!loggedInUser) {
    throw new UserNotFoundError()
  }
  if (!await compareHashPassword(password, loggedInUser.password)) {
    throw new InvalidPasswordError()
  }
  return loggedInUser.publicDataValues()
}

const recoverPassword = async (email) => {
  const recoverUser = await user.findOne({ where: { email } })

  if (!recoverUser) return

  token = signRecovery(recoverUser.id)

  link = `https://${process.env.MAIN_SITE}/reset?=${token}`

  const mailOptions = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Recuperação de Senha Hemocione",
    text: `Olá ${recoverUser.givenName} \n 
    Please click on the following link ${link} to reset your password. \n\n 
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  }

  sgMail.send(mailOptions, (error, result) => {
    if (error) throw new CustomAPIError("EmailServiceError", "Couldn't send email", 500)
  })
}

const resetPassword = async (id, newPassword) => {
  const recoverUser = await user.findOne({ where: { id } })

  if (!recoverUser) return

  recoverUser.password = newPassword
  await model.update(recoverUser, { where: { id } })
}

module.exports = { register, login, recoverPassword, resetPassword }
