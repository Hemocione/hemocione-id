const jwt = require("jsonwebtoken");

const sign = (data, expires = "7d") => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {
    expiresIn: expires,
  });
};

const verify = (token) => {
  const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return data;
};

const signUser = (user, expires = "7d") => {
  return sign(
    {
      id: user.id,
      givenName: user.givenName,
      surName: user.surName,
      bloodType: user.bloodType,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      document: user.document,
    },
    expires
  );
};

const signRecovery = (id, expires = "1h") => {
  return sign({ id }, expires);
};

module.exports = { sign, signUser, verify, signRecovery };
