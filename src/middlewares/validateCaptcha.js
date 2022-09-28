const dotenv = require("dotenv")
dotenv.config()

function validateCaptcha(req, res, next) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.captchaToken}`

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success == true) {
        next()
      } else {
        return res.status(401).json({ message: "Verificação do Captcha falhou." })
      }
    })
    .catch((e) => {
      next(e)
    })
}

module.exports = validateCaptcha
