const { CustomAPIError } = require('./customAPIError')

class AuthError extends CustomAPIError {
  constructor(name, message, statusCode) {
    super(name, message, statusCode, 'AuthError')
  }
}

class UserNotFoundError extends AuthError {
  constructor(message = 'Usuário não encontrado.') {
    super('UserNotFoundError', message, 404)
  }
}

class InvalidCredentialsError extends AuthError {
  constructor(message = 'Credenciais inválidas.') {
    super('InvalidCredentialsError', message, 401)
  }
}

class InvalidUserParamsError extends AuthError {
  constructor(message = 'Parâmetros de usuário inválidos.') {
    super('InvalidUserParamsError', message, 422)
  }
}

class InvalidTokenData extends AuthError {
  constructor(message = 'Token inválido.') {
    super('InvalidTokenData', message, 401)
  }
}

class ForbiddenError extends AuthError {
  constructor(message = 'Você não tem permissão para fazer isso.') {
    super('ForbiddenError', message, 403)
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidUserParamsError,
  InvalidTokenData,
  AuthError,
  ForbiddenError,
}
