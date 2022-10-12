const { CustomAPIError } = require('./customAPIError')

class RecaptchaError extends CustomAPIError {
  constructor(name, message, statusCode) {
    super(name, message, statusCode, 'RecaptchaError')
  }
}

class InvalidRecaptchaError extends RecaptchaError {
  constructor(message = 'Erro de captcha. Você é um robô?') {
    super('InvalidRecaptchaError', message, 403)
  }
}

module.exports = {
  InvalidRecaptchaError,
}
