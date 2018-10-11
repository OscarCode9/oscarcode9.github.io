

const nodemailer = require('nodemailer');

function sendEmail(req, res, next) {

  const name = req.fields.name;
  const subject = req.fields.subject;
  const message = req.fields.message;
  const email = req.fields.email;
  const emailTo = req.fields.emailTo;


    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORDEMAIL // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: `"${name} 👻" <${email}>`, // sender address
      to: `${emailTo}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `${message}`, // plain text body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send({
        message: 'El mensaje ha sido enviado' 
      })

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
 

}

module.exports = sendEmail;