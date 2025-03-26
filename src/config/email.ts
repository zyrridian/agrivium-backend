import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { auth } from "../config/firebase";

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

export async function sendFirebaseVerificationEmail(email: string) {
  const verificationLink = await auth.generateEmailVerificationLink(email);

  console.log(`Verification link: ${verificationLink}`);
  // Send Firebase's verification email to the user
  await sendEmail(
    email,
    "Verify Your Email",
    `Click here to verify: ${verificationLink}`
  );
}
