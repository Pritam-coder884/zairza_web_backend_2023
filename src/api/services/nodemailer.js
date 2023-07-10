const nodemailer = require("nodemailer")
const ejs = require("ejs");
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

const sendingEmail = async ({ userEmail, data }) => {

  // const receivers = ["devashritbehera@gmail.com","devashritcode@gmail.com", "greendoor3000@gmail.com"]
  // const email = req.body.email;

  ejs.renderFile(
    `${__dirname}/mailTemplate.ejs`,
    {
      ...data,
    },
    (err, html) => {
      if (err) {
        console.log(err);
      } else {
        let mailOptions = {
          from: "perceptionperception100@gmail.com",
          to: userEmail,
          subject: 'Nodemailer Project',
          // text: 'Hi from your nodemailer projec hi dsndaksdnsak'
          html: `${html}`
        };



        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email Sent Successfully : ", data.response);
          }
        });
      }
    }
  )

}

module.exports = { sendingEmail }