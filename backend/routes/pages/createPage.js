import Page from "../../models/Page.js";
import { verifyToken } from "../../util/token.js";


export default async function createPage(req) {
    try {
        const { pageName, token } = req.body;

        // validate user token
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "message": "User not logged in"
                }
            };
        }

        // create new page and save to db
        const newPage = new Page({
            pageName: pageName,
            pageData: " ",
            owner: user._id
        });
        await newPage.save();
        
        // add page id to user list of page ids
        user.pages.push(newPage._id);
        await user.save();

        // return the new page to the user
        return {
            resStatus: 200,
            resMessage: {
                "message": "Page created",
                "Page": newPage
            }
        };

    } catch (err) {
        console.log(err);
        return {
            resStatus: 500,
            resMessage: {
                "message": "Internal server error"
            }
        };
    }
}
