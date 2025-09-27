import express from "express";

import createPage from "./createPage.js";

const router = express.Router();

router.post("/createpage", async (req,res) => {
    const { resStatus, resMessage } = await createPage(req);
    res.status(resStatus).json(resMessage);
});

export default router;
