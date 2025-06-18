import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,      // your Gmail
            pass: process.env.EMAIL_PASS,      // App password
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
}
