import express from "express";
import signup from "./signup.js";

const router = express.Router();

router.post("/signup", async (req,res) => {
    const { resStatus, resMessage } = await signup(req);

    res.status(resStatus).json(resMessage);
});

export default router;
