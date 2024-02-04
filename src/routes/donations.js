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
  const parsedDate = Date.parse(donationDate);
  const userCanDonate = await donationService.checkIfUserCanDonateAtCertainDate(
    user.id,
    user.gender || "M",
    new Date(parsedDate)
  );
  if (!userCanDonate) {
    return res.status(409).json({
      message:
        "Data inválida para doação - tempo mínimo entre doações não respeitado ou limite de doações por ano atingido. Você realmente doou nesta data ?",
    });
  }

  const registeredDonation = await donationService.createUserDonation(user.id, {
    donationDate,
    label: donationLabel,
  });
  res.status(201).json({
    message: "Doação registrada com sucesso",
    donation: registeredDonation,
  });
});

module.exports = { url: "/donations", router };
