const { CustomAPIError } = require('./customAPIError')

class AuthError extends CustomAPIError {
  constructor(name, message, statusCode) {
    super(name, message, statusCode, 'AuthError');
  }
}

class UserNotFoundError extends AuthError {
  constructor(message='Usuário não encontrado.') {
    super("UserNotFoundError", message, 404);
  }
}

class InvalidPasswordError extends AuthError {
  constructor(message='Senha incorreta.') {
    super("InvalidPasswordError", message, 401);
  }
}

class InvalidUserParamsError extends AuthError {
  constructor(message="Parâmetros de usuário inválidos.") {
    super("InvalidUserParamsError", message, 422);
  }
}

class InvalidTokenData extends AuthError {
  constructor(message="Token inválido.") {
    super("InvalidTokenData", message, 401);
  }
}

module.exports = { UserNotFoundError, InvalidPasswordError, InvalidUserParamsError, InvalidTokenData, AuthError };
