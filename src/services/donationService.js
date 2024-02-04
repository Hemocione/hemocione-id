const { userDonation } = require("../db/models");

const createUserDonation = async (userId, { donationDate, label }) => {
  const donation = await userDonation.create({
    userId,
    donationDate,
    label,
  });

  return donation;
};

module.exports = { createUserDonation };
