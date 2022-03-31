const CustomError = require('./customError')

class AuthError extends CustomError {}

class UserNotFoundError extends AuthError {
  constructor() {
    super('Usuário não encontrado.');
    this.name = "UserNotFoundError";
  }
}

class InvalidPasswordError extends AuthError {
  constructor() {
    super('Senha incorreta.');
    this.name = "InvalidPasswordError";
  }
}

class UserRegistrationError extends AuthError {
  constructor(registrationErrorMessage) {
    super(registrationErrorMessage);
    this.name = "UserRegistrationError";
  }
}

module.exports = { UserNotFoundError, InvalidPasswordError, AuthError };
