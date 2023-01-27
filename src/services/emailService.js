const { CustomAPIError } = require('../errors/customAPIError')
const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendRecoveryEmail = async (email, givenName, link) => {
    const mailOptions = {
        to: email,
        from: process.env.FROM_EMAIL,
        templateId: process.env.SGMAIL_TEMPLATE_ID,
        dynamicTemplateData: {
            userName: givenName,
            recoveryLink: link,
        },
    };
    return await sgMail.send(mailOptions, (error, result) => {
        if (error) {
            console.log(error)
            throw new CustomAPIError("EmailServiceError", "Couldn't send email", 500)
        }
    })
}

module.exports = { sendRecoveryEmail };
