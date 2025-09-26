import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB, PORT } from "./config.js";

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(DB)
    .then(() => {
        console.log("connected to db");

        app.listen(PORT, () => {
            console.log(`API listening on port: ${PORT}`);
        })
    });
