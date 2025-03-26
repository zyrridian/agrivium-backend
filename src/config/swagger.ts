import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

export const midtrans = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
