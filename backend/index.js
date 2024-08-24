import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectToDB from './config/db.js'; 
import userRouter from "./routes/userRoutes.js"; 
import foodRouter from "./routes/foodRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectToDB();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
