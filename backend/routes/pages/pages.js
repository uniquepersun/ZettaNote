import express from "express";

import createPage from "./createPage.js";
import savePage from "./savePage.js";
import renamePage from "./renamePage.js";
import { getPage, getPages } from "./getPages.js";
import deletePage from "./deletePage.js";

const router = express.Router();

router.post("/createpage", async (req,res) => {
    const { resStatus, resMessage } = await createPage(req);
    res.status(resStatus).json(resMessage);
});

router.post("/savepage", async (req,res) => {
    const { resStatus, resMessage } = await savePage(req);
    res.status(resStatus).json(resMessage);
});

router.post("/renamepage", async (req,res) => {
    const { resStatus, resMessage } = await renamePage(req);
    res.status(resStatus).json(resMessage);
});

router.get("/getpage", async (req,res) => {
    const { resStatus, resMessage } = await getPage(req);
    res.status(resStatus).json(resMessage);
});

router.get("/getpages", async (req, res) => {
    const { resStatus, resMessage } = await getPages(req);
    res.status(resStatus).json(resMessage);
});

router.delete("/deletepage", async (req,res) => {
    const { resStatus, resMessage } = await deletePage(req);
    res.status(resStatus).json(resMessage);
});

export default router;
