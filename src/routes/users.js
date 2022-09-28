const express = require("express")
const { signUser } = require("../utils/jwt")
const router = express.Router()
const authenticate = require("../middlewares/authenticate")
const authenticateRecovery = require("../middlewares/authenticateRecovery")
const validateCaptcha = require("../middlewares/validateCaptcha")
const wrapAsyncOperationalErrors = require('../utils/wrapAsyncOperationalErrors')
const userService = require('../services/userService')

router.post("/login", validateCaptcha, wrapAsyncOperationalErrors(async (req, res, next) => {
  const { email, password } = req.body
  const user = await userService.login(email, password)
  const token = signUser(user)
  res.status(200).json({ user: user, token: token })
}))

router.post("/register", validateCaptcha, wrapAsyncOperationalErrors(async (req, res, next) => {
  const user = await userService.register(req.body)
  const token = signUser(user)
  res.status(200).json({ user: user, token: token })
}))

router.get("/validate-token", authenticate, wrapAsyncOperationalErrors(async (req, res, next) => {
  res.status(200).json({ message: "Token válido.", user: req.authUser })
}))

router.post("/recover-password", validateCaptcha, wrapAsyncOperationalErrors(async (req, res, next) => {
  const { email } = req.body
  await userService.recoverPassword(email)
  res.status(200)
}))

router.post("/reset-password", validateCaptcha, authenticateRecovery, wrapAsyncOperationalErrors(async (req, res, next) => {
  await userService.resetPassword(req.accountId, req.body.newPassword)
  res.status(200)
}))

module.exports = { url: "/users", router }
