import express from "express";
import dotenv from "dotenv";
import medicineRoutes from "./routes/medicineRoutes.js";

import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes

app.use("/api/medicines", medicineRoutes);





const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//  Export app for Jest testing
export default app;