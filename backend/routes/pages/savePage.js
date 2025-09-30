import Page from "../../models/Page.js";
import { verifyToken } from "../../util/token.js";

export default async function savePage(req) {
    try {
        const { token, pageId, newPageData } = req.body;

        // verify user and find page in DB
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "message": "User not logged in"
                }
            };
        }

        const page = await Page.findById(pageId);
        if (!page) {
            return {
                resStatus: 404,
                resMessage: {
                    "message": "Page not found"
                }
            };
        }

        // checks if user is the owner of the page
        if (!page.owner.equals(user._id)) {
            return {
                resStatus: 403,
                resMessage: {
                    "message": "Not authorized"
                }
            };
        }

        // change the page data and save to DB
        page.pageData = newPageData;
        await page.save();

        // return new page to user
        return {
            resStatus: 200,
            resMessage: {
                "Updated Page": page
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
