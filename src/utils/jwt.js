const jwt = require("jsonwebtoken");

const sign = (data, expires = "7d") => {
  return jwt.sign(data.toJSON(), process.env.JWT_SECRET_KEY, {
    expiresIn: expires,
  });
}

const verify = (token) => {
  const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return data;
}

const signUser = (user, expires = '7d') => {
  return sign({
    id: user.id,
    givenName: user.givenName,
    bloodType: user.bloodType,
    email: user.email,
    name: user.name,
    mainRole: user.isAdmin ? 'admin' : 'user'
  }, expires);
}

module.exports = { sign, signUser, verify };
