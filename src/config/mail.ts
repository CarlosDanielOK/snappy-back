import { config as dotenvConfig } from 'dotenv';
import * as nodemailer from 'nodemailer';


dotenvConfig({ path: '.env' });

const configMail = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

const mailTransporter = nodemailer.createTransport(configMail);

const mailFrom = `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`;

export { mailTransporter, mailFrom };

