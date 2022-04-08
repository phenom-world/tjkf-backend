const nodemailer = require('nodemailer');
const { google } = require('googleapis');


const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID , process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN})

exports.sendMail = async(details, res) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            }
        })
        const mailOptions = {
            from: 'TEAM JKF <support@teamjkf.com>',
            to: details.email,
            subject: details.subject,
            html: details.html
        }
        const result = await transport.sendMail(mailOptions)
        res.status(200).json({success : true, message: `Email sent`})
        return result
    } catch (error) {
        res.status(401)
        throw new Error(`Email not sent`);
    }
}