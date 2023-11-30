const { CustomAPIError } = require("../errors/customAPIError");
const dotenv = require("dotenv");
const { Resend } = require("resend");
dotenv.config();
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getRecoveryEmailHtml = (userName, recoveryLink) => {
  return `<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <body style="min-width: 100%;
               min-height: 100%;
               text-align: center;
               margin: 0;
               padding: 0;
               font-family: Arial;">
    <table style="width: 80%;
                  height: 80%;
                  border-radius: 20px;
                  background-color: #E3E3E3; 
                  margin: 10%;
                  padding: 30px;
                  text-align: center;">
      <tr><td>
        <img src="https://cdn.hemocione.com.br/logos/HemoLogo.svg"
             style="width: 15%;
                    height: auto"/>
      </td></tr>
      <tr><td>
        <p>Olá, ${userName}</p>
      </td></tr>
      <tr><td>
        <a href="${recoveryLink}">
          <button style="text-decoration: none;
                         background-color: #CD1419;
                         padding: 15px;
                         color: #FFFFFF;
                         border-radius: 15px;
                         border-color: #CD1419;
                         cursor: pointer">
            Clique aqui e altere sua senha agora!
          </button>
        </a>
      </td></tr>
      <tr><td>
        <p> Se você não requisitou a alteração da sua senha, por favor ignore este email. </p>
      </td></tr>
    </table>
    <p>@ Hemocione 2023</p>
  </body>
</html>`;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const sendRecoveryEmail = async (email, givenName, link) => {
  // const mailOptions = {
  //   to: email,
  //   from: process.env.FROM_EMAIL,
  //   templateId: process.env.SGMAIL_TEMPLATE_ID,
  //   dynamicTemplateData: {
  //     userName: givenName,
  //     recoveryLink: link,
  //   },
  // };
  // return await sgMail.send(mailOptions, (error, result) => {
  //   if (error) {
  //     console.log(error);
  //     throw new CustomAPIError(
  //       "EmailServiceError",
  //       "Erro ao enviar e-mail",
  //       500
  //     );
  //   }
  // });
  const html = getRecoveryEmailHtml(givenName, link);
  try {
    await resend.emails.send({
      from: process.env.FROM_MAIL || "noreply@hemocione.com.br",
      to: email,
      subject: "Recuperação de Senha Hemocione",
      html,
    });
  } catch (e) {
    console.error(e);
    throw new CustomAPIError("EmailServiceError", "Erro ao enviar e-mail", 500);
  }
};

module.exports = { sendRecoveryEmail };
