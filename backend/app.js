import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB, PORT } from "./config.js";

import authRouter from "./routes/auth/auth.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);

mongoose.connect(DB)
    .then(() => {
        console.log("connected to db");

        app.listen(PORT, () => {
            console.log(`API listening on port: ${PORT}`);
        })
    });
