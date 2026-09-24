import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "c:/Users/HP Core i5/Desktop/SGB MILITARY/.env.local" });

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

mailer.sendMail({
  from: `"SGB Military" <${process.env.SMTP_USER}>`,
  to: "duvanpalacios830@gmail.com",
  subject: "TEST SCRIPT",
  html: "<p>Prueba de nodemailer.</p>"
}).then(info => console.log("Success:", info.messageId))
  .catch(err => console.error("Error:", err));
