// Pwd - O39UPqxSpbQ9hQG1
import express from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["https://expense-tracker-nine-tau.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

const mongoURI =
  "mongodb+srv://viswanath:O39UPqxSpbQ9hQG1@personalfinancetracker.mmb3s.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.error("Failed to connect with mongodb:", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
