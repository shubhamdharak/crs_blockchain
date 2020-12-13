// Mail Configuration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return false;
            } else {
              return true;
            }
          });
    }
}