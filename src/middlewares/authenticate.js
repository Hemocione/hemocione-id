const { verify } = require("../utils/jwt")
const jwt = require("jsonwebtoken")

function authenticate(req, res, next) {
  const data = req.headers.authorization
  if (data !== undefined && data.substring(0, 7) === "Bearer ") {
    const token = data.substring(7)
    try {
      const entity = verify(token)
      delete entity.iat
      delete entity.exp
      req.tokenObj = entity
      next()
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expirado" })
      } else if (e instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Assinatura inválida" })
      } else {
        next(e)
      }
    }
  } else {
    res.status(401).json({ message: "Por favor, faça login ou cadastre-se." })
  }
}

module.exports = authenticate
