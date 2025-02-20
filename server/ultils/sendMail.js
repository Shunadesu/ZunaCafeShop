const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html }) => {
    let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_APP_PASWORD,
            },
    })
        
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ZunaCafe 👻" <no-reply@zunacafe.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot Password", // Subject line
        html: html, // html body
    });
    return info
})

module.exports = sendMail