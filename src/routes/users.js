const express = require('express')
const { signUser } = require('../utils/jwt')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const wrapAsyncOperationalErrors = require('../utils/wrapAsyncOperationalErrors')
const userService = require('../services/userService')
const validateRecaptchaService = require('../services/validateRecaptchaService')

router.get(
  '/',
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await userService.validateUserIsAdmin(req.authUser)
    const foundUsers = await userService.findUsers(req.query)
    res.status(200).json(foundUsers)
  })
)

router.put(
  '/:id',
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    const currentUser = await userService.validateUserAccess(
      req.authUser,
      req.params.id
    )
    const updatedUser = await userService.currentUserUpdateUser(
      currentUser,
      req.params.id,
      req.body
    )
    res
      .status(200)
      .json({ message: 'Usuário atualizado com sucesso!', user: updatedUser })
  })
)

router.post(
  '/login',
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await validateRecaptchaService.validateRecaptcha(req.body['g-recaptcha-response'])
    const { email, password } = req.body
    const user = await userService.login(email, password)
    const token = signUser(user)
    res.status(200).json({ user: user, token: token })
  })
)

router.post(
  '/register',
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await validateRecaptchaService.validateRecaptcha(req.body['g-recaptcha-response'])
    const user = await userService.register(req.body)
    const token = signUser(user)
    res.status(200).json({ user: user, token: token })
  })
)

router.get(
  '/validate-token',
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    const userData = req.authUser
    const user = await userService.findUserFromTokenData(userData)
    res.status(200).json({ message: 'Token válido.', user: user })
  })
)

module.exports = { url: '/users', router }
