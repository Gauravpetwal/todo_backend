const nodemailer = require("nodemailer");



const RegisterMailSender = (Mail,Name,template) =>{
     console.log("hit")
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      })

      const mailOptions = {
        from: process.env.USER,
        to: Mail,
        subject: `Welcome ${Name}`,
        html: template,
    };
    

      const info = transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      });    

}



module.exports= RegisterMailSender;