const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');


const transport = nodemailer.createTransport(
    {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "mishraakarsh674@gmail.com",
            pass: "iubh ocim zngy hnvs",
        },
    }
);

// if (process.env.NODE_ENV !== 'test' || process.env.NODE_ENV !== 'development') {
if (process.env.NODE_ENV !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const sendEmail = async (to, subject, text) => {
    const msg = { from: "mishraakarsh674@gmail.com", to, subject, text };
    await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `https://financemanagementsystem.vercel.app/confirm-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};


const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `https://financemanagementsystem.vercel.app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
};

const sendOtpForLogin = async (to, otp) => {
    const subject = 'Login OTP';
    const text = `Dear User,\nWelcome to FMS, your login otp is ${otp}.\nDon't disclose this otp with anyone.`;
    await sendEmail(to, subject, text);
};

module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
    sendOtpForLogin,
};
