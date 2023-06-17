const nodemailer = require('nodemailer');
require('dotenv').config()
async function mailer(otp, email) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderPass
        }
    });


    let mailOptions = {
        from: process.env.senderEmail,
        to: email,
        subject: 'TIC TAC TOE',
        html: `<p>Your OTP for login in Tic Tac Toe is ${otp}.<br> Please do not share your OTP with others <br>Your OTP will expire within 2 min. <br></p>`
    }
    // send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            console.log('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);

        }
    });

}



module.exports = { mailer }
