const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const emailTemplate = text => `
  <div className="email" style="
    border: 1px solid #e24727;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hope you are having a great day</h2>
    <p>${text}</p>

    <p>Best,</p>
    <p>Cleo Wangayi, creator of Dev_Blogger</p>
  </div>
`;

module.exports = { emailTemplate, transport };