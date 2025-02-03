const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
        }
    });

    const message = {
        from: `${config.SMTP_FROM_NAME} <${config.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail; 