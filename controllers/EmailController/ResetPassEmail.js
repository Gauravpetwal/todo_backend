const nodemailer = require("nodemailer");

//Function for forget password
const forgetPassword = (Email,template) =>{
      const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

   const mailOptions = {
        from: process.env.USER,
        to: Email,
        subject: "Your one time password",
        html:template,
      };

      const info = transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      }); 
}

module.exports = forgetPassword;