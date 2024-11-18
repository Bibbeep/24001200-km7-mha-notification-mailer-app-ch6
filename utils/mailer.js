const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS
    }
});

module.exports = async (email, subject, message) => {
    await transporter.sendMail({
        from: 'Bibbeep support<muhammadhabibalfarabi290803@gmail.com>',
        to: email,
        subject: subject,
        text: message
    });
};