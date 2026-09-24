import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const SENDER_EMAIL = `"SGB Military" <${process.env.SMTP_USER}>`;
