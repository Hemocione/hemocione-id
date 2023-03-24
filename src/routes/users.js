const express = require("express");
const { signUser } = require("../utils/jwt");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const wrapAsyncOperationalErrors = require("../utils/wrapAsyncOperationalErrors");
const userService = require("../services/userService");
const recaptchaService = require("../services/recaptchaService");

router.get(
  "/",
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await userService.validateUserIsAdmin(req.authUser);
    const foundUsers = await userService.findUsers(req.query);
    res.status(200).json(foundUsers);
  })
);

router.put(
  "/:id",
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    const currentUser = await userService.validateUserAccess(
      req.authUser,
      req.params.id
    );
    const updatedUser = await userService.currentUserUpdateUser(
      currentUser,
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Usuário atualizado com sucesso!", user: updatedUser });
  })
);

router.post(
  "/login",
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await recaptchaService.validateRecaptcha(req.body["g-recaptcha-response"]);
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    const token = signUser(user);
    res.status(200).json({ user: user, token: token });
  })
);

router.post(
  "/register",
  wrapAsyncOperationalErrors(async (req, res, next) => {
    // await recaptchaService.validateRecaptcha(req.body['g-recaptcha-response'])
    const user = await userService.register(req.body);
    const token = signUser(user);
    res.status(200).json({ user: user, token: token });
  })
);

router.get(
  "/validate-token",
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    res.status(200).json({ message: "Token válido.", user: req.authUser });
  })
);

router.post(
  "/recover-password",
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await recaptchaService.validateRecaptcha(req.body["g-recaptcha-response"]);
    const { email } = req.body;
    await userService.recoverPassword(email);
    res.sendStatus(200);
  })
);

router.post(
  "/reset-password",
  authenticate,
  wrapAsyncOperationalErrors(async (req, res, next) => {
    await recaptchaService.validateRecaptcha(req.body["g-recaptcha-response"]);
    await userService.resetPassword(req.tokenObj.id, req.body.newPassword);
    res.sendStatus(200);
  })
);

module.exports = { url: "/users", router };
