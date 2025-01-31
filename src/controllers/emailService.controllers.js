import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

async function sendEmail(email,subject, body){
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  try {
    await transporter.verify();
    console.log('SMTP server is ready to take messages:');
  } catch (error) {
    console.error('Error verifying the server:', error);
  }

  await transporter.sendMail({
    to: email,
    subject: subject,
    html: body
  });
}

export {
  sendEmail
}