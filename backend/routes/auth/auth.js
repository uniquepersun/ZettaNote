import express from "express";

import signup from "./signup.js";
import login from "./login.js";
import changePassword from "./changePassword.js";

const router = express.Router();

router.post("/signup", async (req,res) => {
    const { resStatus, resMessage } = await signup(req);
    res.status(resStatus).json(resMessage);
});

router.post("/login", async (req,res) => {
    const { resStatus, resMessage } = await login(req);
    res.status(resStatus).json(resMessage);
});


router.post("/changepassword", async (req,res) => {
    const { resStatus, resMessage } = await changePassword(req);
    res.status(resStatus).json(resMessage);
})
export default router;
