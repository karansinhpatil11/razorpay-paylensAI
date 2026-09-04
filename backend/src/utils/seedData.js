const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");

dotenv.config({ path: "./.env" });

const payments = [
  { paymentId: "PAY1001", amount: 1299, status: "FAILED", bank: "HDFC", method: "UPI", errorCode: "TIMEOUT", errorMessage: "UPI transaction timeout" },
  { paymentId: "PAY1002", amount: 799, status: "FAILED", bank: "HDFC", method: "UPI", errorCode: "GATEWAY_TIMEOUT", errorMessage: "Gateway timeout" },
  { paymentId: "PAY1003", amount: 2499, status: "FAILED", bank: "SBI", method: "CARD", errorCode: "AUTH_FAILED", errorMessage: "Authorization declined" },
  { paymentId: "PAY1004", amount: 499, status: "SUCCESS", bank: "ICICI", method: "UPI" },
  { paymentId: "PAY1005", amount: 1899, status: "SUCCESS", bank: "HDFC", method: "NETBANKING" },
];

async function seed() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required in backend/.env");
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all(payments.map((payment) => Payment.updateOne(
    { paymentId: payment.paymentId },
    { $set: payment },
    { upsert: true }
  )));
  console.log(`Seeded ${payments.length} payments.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seeding failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
