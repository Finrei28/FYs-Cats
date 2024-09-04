require('dotenv').config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const sendEmail = async (to, subject, html) => {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILSEND_API_KEY,
    });

    const sentFrom = new Sender("support@fyscats.com");

    const recipients = [
      new Recipient(to)
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(html)
      .setText("This is the text content");

    // Attempt to send the email
    const result = await mailerSend.email
    .send(emailParams)
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
    return result
  }

module.exports = sendEmail;
