class CustomAPIError extends Error {
  constructor(name, message, statusCode, errorType) {
    super(message)
    this.name = name
    this.statusCode = statusCode
    this.errorType = errorType
  }
}

module.exports = { CustomAPIError }
