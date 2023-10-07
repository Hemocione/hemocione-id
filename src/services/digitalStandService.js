const axios = require("axios");
const digitalStandApiUrl =
  process.env.DIGITAL_STAND_API_URL ||
  "https://us-east1-estande-digital.cloudfunctions.net/api";
const digitalStandApiSecret = process.env.DIGITAL_STAND_API_SECRET;

const updateStatus = async (leadId, uuid, status) => {
  try {
    await axios.post(
      `${digitalStandApiUrl}/integration/lead/status?leadId=${leadId}&uuid=${uuid}`,
      {
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-secret": digitalStandApiSecret,
        },
      }
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = { updateStatus };
