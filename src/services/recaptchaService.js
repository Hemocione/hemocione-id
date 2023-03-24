const { InvalidRecaptchaError } = require("../errors/recaptchaErrors");
const dotenv = require("dotenv");
dotenv.config();

const validateRecaptcha = async (recaptchaToken) => {
  try {
    const googleRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        body: `secret=${process.env.SECRET_RECAPTCHA_KEY}&response=${recaptchaToken}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const googleResJson = await googleRes.json();
    if (!googleResJson["success"]) {
      throw new InvalidRecaptchaError();
    }
  } catch (error) {
    throw new InvalidRecaptchaError();
  }
};

module.exports = { validateRecaptcha };
