const { verify } = require("../utils/jwt")
const jwt = require("jsonwebtoken")

function authenticateRecovery(req, res, next) {
  const token = req.query.token
  if (token !== undefined) {
    try {
      const accountId = verify(token)
      delete entity.iat
      delete entity.exp
      req.accountId = accountId
      next()
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Link expirado" })
      } else if (e instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Link inválido" })
      } else {
        next(e)
      }
    }
  } else {
    res.status(401).json({ message: "Link inválido." })
  }
}

module.exports = authenticateRecovery
