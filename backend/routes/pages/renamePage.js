import Page from "../../models/Page.js";
import { verifyToken } from "../../util/token.js";

export default async function renamePage(req) {
    try {
        const { token, pageId, newPageName } = req.body;

        // verify user and find page in DB
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "User not logged in"
                }
            };
        }

        const page = await Page.findById(pageId);
        if (!page) {
            return {
                resStatus: 404,
                resMessage: {
                    "Error": "Page not found"
                }
            };
        }

        // checks if user is the owner of the page
        if (!page.owner.equals(user._id)) {
            return {
                resStatus: 403,
                resMessage: {
                    "Error": "Not authorized"
                }
            };
        }

        // change the page name and save to DB
        page.pageName = newPageName;
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
                "Error": "Internal server error"
            }
        };
    }
}
