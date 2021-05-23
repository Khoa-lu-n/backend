const sgMail = require('@sendgrid/mail');
const config = require("config");

module.exports = async (data) => {
    let msg = {
        to: data.to, // Change to your recipient
        from: config.get("verified_sender"), // Change to your verified sender
        subject: data.subject,
        text: data.content
      }
    await sgMail.setApiKey(config.get("sendgrid_secret"));
    await sgMail.send(msg)
}