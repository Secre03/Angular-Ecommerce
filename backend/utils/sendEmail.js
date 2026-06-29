// Email utility - ready to plug in Nodemailer or any SMTP provider
// Install nodemailer: npm install nodemailer

const sendEmail = async (options) => {
  // Uncomment and configure when ready to send emails:
  //
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_EMAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });
  //
  // await transporter.sendMail({
  //   from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
  //   to: options.email,
  //   subject: options.subject,
  //   html: options.html,
  // });

  console.log(`[EMAIL] To: ${options.email} | Subject: ${options.subject}`);
};

module.exports = sendEmail;
