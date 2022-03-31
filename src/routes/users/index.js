const express = require("express");
const { signUser } = require("../../utils/jwt");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
import { AuthError } from "../../errors/AuthErrors";
const userService = require('../services/models/userService');

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.login(email, password);
    const token = signUser(user)
    res.status(200).json({ user: user, token: token });
  } catch(e) {
    if (e instanceof AuthError) {
      res.status(401).json({ message: e.message });
    } else {
      next(e);
    }
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    const token = signUser(user)
    res.status(200).json({ user: user, token: token });
  } catch(e) {
    if (e instanceof AuthError) {
      res.status(401).json({ message: e.message });
    } else {
      next(e);
    }
  }
});

module.exports = { url: "/users", router };
