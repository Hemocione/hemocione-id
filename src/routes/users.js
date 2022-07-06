const express = require('express')
const { signUser } = require('../utils/jwt')
const { selectObjKeys } = require('../utils/selectObjKeys')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const wrapAsyncOperationalErrors = require('../utils/wrapAsyncOperationalErrors')
const userService = require('../services/userService')

router.post(
  '/login',
  wrapAsyncOperationalErrors(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userService.login(email, password)
    const token = signUser(user)
    res.status(200).json({ user: user, token: token })
  })
)

router.post(
  '/register',
  wrapAsyncOperationalErrors(async (req, res, next) => {
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
    const user = await userService.validateUserTokenData(userData)
    res.status(200).json({ message: 'Token válido.', user })
  })
)

module.exports = { url: '/users', router }
