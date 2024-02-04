const { userDonation } = require("../db/models");

const GENDER_CONFIG_DONATION_HABILITY = {
  M: {
    limitDaysInterval: 60,
    limitPerYear: 4,
  },
  F: {
    limitDaysInterval: 90,
    limitPerYear: 3,
  },
  O: {
    limitDaysInterval: 90,
    limitPerYear: 3,
  },
};

const checkIfDonationDateRespectsInterval = (
  donationIndex,
  donationsOrdered,
  limitDaysInterval
) => {
  const leftDonation = donationIndex
    ? donationsOrdered[donationIndex - 1]
    : null;
  const rightDonation = donationsOrdered[donationIndex + 1];

  if (leftDonation) {
    const daysInterval =
      (donationsOrdered[donationIndex].donationDate.getTime() -
        leftDonation.donationDate.getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysInterval < limitDaysInterval) return false;
  }

  if (rightDonation) {
    const daysInterval =
      (rightDonation.donationDate.getTime() -
        donationsOrdered[donationIndex].donationDate.getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysInterval < limitDaysInterval) return false;
  }

  return true;
};

const checkIfDonationDateRespectsYearLimit = (
  donationIndex,
  donationsOrdered,
  limitPerYear
) => {
  const newDonation = donationsOrdered[donationIndex];
  const leftDonations = donationsOrdered.slice(0, donationIndex + 1);
  const rightDonations = donationsOrdered.slice(
    donationIndex,
    donationIndex + limitPerYear + 1
  );
  if (
    leftDonations.length < limitPerYear &&
    rightDonations.length < limitPerYear
  )
    return true;

  const firstLeftDonationDate = leftDonations[0].donationDate;
  const lastRightDonationDate =
    rightDonations[rightDonations.length - 1].donationDate;
  const donationDate = newDonation.donationDate;

  if (
    donationDate.getTime() -
      (firstLeftDonationDate.getTime() / 365) * 24 * 60 * 60 * 1000 <
    1
  )
    return false;
  if (
    lastRightDonationDate.getTime() -
      (donationDate.getTime() / 365) * 24 * 60 * 60 * 1000 <
    1
  )
    return false;

  return true;
};

const checkIfUserCanDonateAtCertainDate = async (
  userId,
  gender,
  donationDate
) => {
  const donationHabilityConfig = GENDER_CONFIG_DONATION_HABILITY[gender];
  const userDonations = await userDonation.findAll({
    select: ["id", "donationDate"],
    where: {
      userId,
    },
  });
  const userDonationsCount = userDonations.length;
  if (userDonationsCount < donationHabilityConfig.limitPerYear) return true;
  const allDonations = userDonations
    .map((d) => ({
      id: d.dataValues.id,
      donationDate: new Date(d.dataValues.donationDate),
    }))
    .concat({ donationDate, id: null });
  const orderedDonations = allDonations.sort(
    (a, b) => a.donationDate - b.donationDate
  );
  const newDonationIndex = orderedDonations.findIndex(
    (donation) => donation.id === null
  );
  const canUserDonateAtInterval = checkIfDonationDateRespectsInterval(
    newDonationIndex,
    orderedDonations,
    donationHabilityConfig.limitDaysInterval
  );
  const canUserDonateAtYearLimit = checkIfDonationDateRespectsYearLimit(
    newDonationIndex,
    orderedDonations,
    donationHabilityConfig.limitPerYear
  );
  return canUserDonateAtInterval && canUserDonateAtYearLimit;
};

const createUserDonation = async (userId, { donationDate, label }) => {
  const donation = await userDonation.create({
    userId,
    donationDate,
    label,
  });

  return donation;
};

module.exports = { createUserDonation, checkIfUserCanDonateAtCertainDate };
