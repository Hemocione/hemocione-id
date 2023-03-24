const wrapAsyncOperationalErrors = require("../utils/wrapAsyncOperationalErrors");
const recaptchaService = require("../services/recaptchaService");

const validateRecaptchaMiddleware = wrapAsyncOperationalErrors(
  async (req, res, next) => {
    await recaptchaService.validateRecaptcha(req.body["g-recaptcha-response"]);
    next();
  }
);

module.exports = validateRecaptchaMiddleware;
