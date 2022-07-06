const { user } = require('../db/models')
const { generateHashPassword, compareHashPassword } = require('../utils/hash')
const { selectObjKeys } = require('../utils/selectObjKeys')
const {
  UserNotFoundError,
  InvalidPasswordError,
  InvalidUserParamsError,
  InvalidTokenData,
  ForbiddenError,
} = require('../errors/authErrors')
const { ValidationError } = require('sequelize')
const _ = require('lodash')

const register = async (userData) => {
  // not using image for now
  const desiredKeys = [
    'givenName',
    'surName',
    'document',
    'phone',
    'bloodType',
    'birthDate',
    'email',
    'password',
    'gender',
  ]
  const filteredUserParams = selectObjKeys(userData, desiredKeys)
  try {
    const createdUser = await user.create({
      ...filteredUserParams,
      password: await generateHashPassword(filteredUserParams.password),
    })
    return createdUser.publicDataValues()
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(
        e.errors.map((error) => error.message).join(', ')
      )
    }
    throw e
  }
}

const login = async (email, password) => {
  const loggedInUser = await user.findOne({ where: { email } })
  if (!loggedInUser) {
    throw new UserNotFoundError()
  }
  if (!(await compareHashPassword(password, loggedInUser.password))) {
    throw new InvalidPasswordError()
  }
  return loggedInUser.publicDataValues()
}

const updateUser = async (userId, userFields, updatableFields) => {
  const filteredFields = selectObjKeys(userFields, updatableFields)

  if (filteredFields.password)
    filteredFields.password = await generateHashPassword(
      filteredFields.password
    )

  try {
    const updatedUsers = await user.update(filteredFields, {
      where: { id: userId },
      returning: true,
      plain: true,
    })

    if (updatedUsers[0] === 0) {
      throw new InvalidUserParamsError()
    }

    return updatedUsers[1].publicDataValues()
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(
        e.errors.map((error) => error.message).join(', ')
      )
    }
    throw e
  }
}

const findUsers = async (
  userParams,
  validSearchKeys = ['id', 'document', 'email', 'isAdmin']
) => {
  const filteredUserParams = selectObjKeys(userParams, validSearchKeys)
  if (_.isEmpty(filteredUserParams)) {
    throw new UserNotFoundError()
  }

  const foundUsers = await user.findAll({ where: filteredUserParams })
  if (foundUsers.length === 0) {
    throw new UserNotFoundError()
  }

  return foundUsers.map((foundUser) => foundUser.publicDataValues())
}

const currentUserUpdateUser = async (currentUser, userId, userFields) => {
  // Admins can name other admins and users are the only ones able to change their own data
  let updatableFields = []
  if (currentUser.id === userId)
    updatableFields = updatableFields.concat(
      'givenName',
      'surName',
      'document',
      'phone',
      'bloodType',
      'birthDate',
      'email',
      'password',
      'gender'
    )
  if (currentUser.isAdmin) updatableFields = updatableFields.concat('isAdmin')

  if (updatableFields.length === 0) throw new ForbiddenError()

  const updatedUser = await updateUser(userId, userFields, updatableFields)
  return updatedUser
}

const findUserFromTokenData = async (tokenUserData) => {
  const validUserKeys = ['id', 'email']
  try {
    const foundUsers = await findUsers(tokenUserData, validUserKeys)
    return foundUsers[0]
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      throw new InvalidTokenData()
    }
  }
}

const validateUserIsAdmin = async (tokenUserData) => {
  const foundUser = await findUserFromTokenData(tokenUserData)
  if (foundUser.isAdmin) return foundUser

  throw new ForbiddenError()
}

const validateUserAccess = async (tokenUserData, targetUserId) => {
  const foundUser = await findUserFromTokenData(tokenUserData)
  if (!foundUser.isAdmin && foundUser.id !== targetUserId) {
    console.log('foi aqui q deu ruim')
    throw new ForbiddenError()
  }

  return foundUser
}

module.exports = {
  register,
  login,
  findUserFromTokenData,
  findUsers,
  validateUserIsAdmin,
  validateUserAccess,
  currentUserUpdateUser,
}
