const nodemailer = require('nodemailer');

async function main(){
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'garry46@ethereal.email',
            pass: '7CEqGWtcRA6q5BjVkZ'
        }
    });
    
    
    // send email
     let info = await transporter.sendMail({
        from: 'prahladkush231@gmail.com',
        to: 'garry46@ethereal.email',
        subject: 'Test email from Nodemailer',
        text: 'Hello from Nodemailer!'
     });
     console.log(info)
}


main()
