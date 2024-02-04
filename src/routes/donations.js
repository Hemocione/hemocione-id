const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const donationService = require("../services/donationService");

router.post("/", authenticate, async (req, res) => {
  // TODO: move logic to check if user can donate or not to backend
  const user = req.authUser;
  const donation = req.body;
  const { donationDate, bloodbankName, label } = donation;
  const donationLabel = label || `Doação para ${bloodbankName}`;
  const registeredDonation = await donationService.createUserDonation(user.id, {
    donationDate,
    label: donationLabel,
  });
  res
    .status(201)
    .json({
      message: "Doação registrada com sucesso",
      donation: registeredDonation,
    });
});

module.exports = { url: "/donations", router };
