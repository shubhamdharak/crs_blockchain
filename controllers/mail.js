// Mail Configuration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS
  }
});


module.exports = {
    send:(sendto,subj,msg)=>{
        const mailOptions = {
            from: process.env.MAIL,
            to: sendto,
            subject: subj,
            html: msg
          };
          let res = null
          res = transporter.sendMail(mailOptions)
          return res
    }
}