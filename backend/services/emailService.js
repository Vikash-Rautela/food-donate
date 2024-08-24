import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER,
        pass: process.env.PASS,
    }
});

export const sendMail = (to, subject, html) => {
    const mailOptions = {
        from: process.env.SENDER,
        to,
        subject,
        html
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject("Failed to send email");
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            }
        });
    });
};
