const { user } = require("../db/models");
const { generateHashPassword, compareHashPassword } = require("../utils/hash");
const { selectObjKeys } = require("../utils/selectObjKeys");
const { signRecovery } = require("../utils/jwt");
const { isObjectEmpty } = require("../utils/isObjectEmpty");
const { sendRecoveryEmail } = require("../services/emailService");
const {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidUserParamsError,
  InvalidTokenData,
  ForbiddenError,
} = require("../errors/authErrors");
const { ValidationError } = require("sequelize");
const _ = require("lodash");

const getUserRegistrationData = (userData) => {
  // not using image for now
  const desiredKeys = [
    "givenName",
    "surName",
    "document",
    "phone",
    "bloodType",
    "birthDate",
    "email",
    "password",
    "gender",
    "address",
  ];
  const userRegistrationData = selectObjKeys(userData, desiredKeys);

  if (
    userRegistrationData.address &&
    _.isObject(userRegistrationData.address) &&
    !isObjectEmpty(userRegistrationData.address)
  ) {
    userRegistrationData.addresses = [userRegistrationData.address];
    delete userRegistrationData.address;
  }

  const queryOptions = {};
  if (userRegistrationData.addresses) {
    queryOptions.include = [{ association: user.associations.addresses }];
  }

  return { userRegistrationData, queryOptions };
};

const register = async (userData) => {
  const { userRegistrationData, queryOptions } =
    getUserRegistrationData(userData);

  console.log(queryOptions);

  try {
    const createdUser = await user.create(
      {
        ...userRegistrationData,
        password: await generateHashPassword(userRegistrationData.password),
      },
      queryOptions
    );

    return createdUser.publicDataValues();
  } catch (e) {
    // if user is trying to register with an already registered email or CPF or invalid data
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(
        e.errors.map((error) => error.message).join(", ")
      );
    }
    throw e;
  }
};

const login = async (email, password) => {
  const loggedInUser = await user.findOne({ where: { email } });
  if (!loggedInUser) {
    throw new InvalidCredentialsError();
  }
  if (!(await compareHashPassword(password, loggedInUser.password))) {
    throw new InvalidCredentialsError();
  }
  return loggedInUser.publicDataValues();
};

const updateUser = async (userId, userFields, updatableFields) => {
  const filteredFields = selectObjKeys(userFields, updatableFields);

  if (filteredFields.password)
    filteredFields.password = await generateHashPassword(
      filteredFields.password
    );

  try {
    const updatedUsers = await user.update(filteredFields, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    if (updatedUsers[0] === 0) {
      throw new InvalidUserParamsError();
    }

    return updatedUsers[1].publicDataValues();
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new InvalidUserParamsError(
        e.errors.map((error) => error.message).join(", ")
      );
    }
    throw e;
  }
};

const findUsers = async (
  userParams,
  validSearchKeys = ["id", "document", "email", "isAdmin"]
) => {
  const filteredUserParams = selectObjKeys(userParams, validSearchKeys);
  if (_.isEmpty(filteredUserParams)) {
    throw new UserNotFoundError();
  }

  const foundUsers = await user.findAll({ where: filteredUserParams });
  if (foundUsers.length === 0) {
    throw new UserNotFoundError();
  }

  return foundUsers.map((foundUser) => foundUser.publicDataValues());
};

const currentUserUpdateUser = async (currentUser, userId, userFields) => {
  // Admins can name other admins and users are the only ones able to change their own data
  let updatableFields = [];
  if (currentUser.id === userId)
    updatableFields = updatableFields.concat(
      "givenName",
      "surName",
      "document",
      "phone",
      "bloodType",
      "birthDate",
      "email",
      "password",
      "gender"
    );
  if (currentUser.isAdmin) updatableFields = updatableFields.concat("isAdmin");

  if (updatableFields.length === 0) throw new ForbiddenError();

  const updatedUser = await updateUser(userId, userFields, updatableFields);
  return updatedUser;
};

const findUserFromTokenData = async (tokenUserData) => {
  const validUserKeys = ["id", "email"];
  try {
    const foundUsers = await findUsers(tokenUserData, validUserKeys);
    return foundUsers[0];
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      throw new InvalidTokenData();
    }
  }
};

const validateUserIsAdmin = async (tokenUserData) => {
  const foundUser = await findUserFromTokenData(tokenUserData);
  if (foundUser.isAdmin) return foundUser;

  throw new ForbiddenError();
};

const validateUserAccess = async (tokenUserData, targetUserId) => {
  const foundUser = await findUserFromTokenData(tokenUserData);
  if (!foundUser.isAdmin && foundUser.id !== targetUserId) {
    throw new ForbiddenError();
  }

  return foundUser;
};

const recoverPassword = async (email) => {
  const recoverUser = await user.findOne({ where: { email } });

  if (!recoverUser) return;
  const token = signRecovery(recoverUser.id);
  const link = `${process.env.MAIN_SITE}/reset/?token=${token}`;
  await sendRecoveryEmail(email, recoverUser.givenName, link);
};

const resetPassword = async (id, newPassword) => {
  const recoverUser = await user.findOne({ where: { id } });
  if (!recoverUser) return;

  recoverUser.password = await generateHashPassword(newPassword);
  await recoverUser.save();
};

const getUserFullData = async (id) => {
  const foundUser = await user.findByPk(id, {
    attributes: user.publicFields,
    include: [
      { association: user.associations.donations, nested: true },
      { association: user.associations.addresses },
    ],
    order: [[user.associations.donations, "donationDate", "DESC"]],
  });

  const donations = foundUser.donations;
  const addresses = foundUser.addresses;
  if (!foundUser) throw new UserNotFoundError();

  return {
    ...foundUser.publicDataValues(),
    donations,
    addresses,
  };
};

module.exports = {
  register,
  login,
  findUserFromTokenData,
  findUsers,
  validateUserIsAdmin,
  validateUserAccess,
  currentUserUpdateUser,
  recoverPassword,
  resetPassword,
  getUserFullData,
};
