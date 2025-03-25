import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  await mailer.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}
