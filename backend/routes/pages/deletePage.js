import Page from "../../models/Page.js";
import { verifyToken } from "../../util/token.js";

export default async function deletePage(req) {
    try {
        const { pageId, token } = req.body;

        // verify user is logged in
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "message": "User not logged in"
                }
            }
        }

        // find page in db 
        const page = await Page.findById(pageId);
        if (!page) {
            return {
                resStatus: 404,
                resMessage: {
                    "message": "Page not found"
                }
            }
        }

        // verify user owns the page
        if (!page.owner.equals(user._id)) {
            return {
                resStatus: 403,
                resMessage: {
                    "message": "Not authorized"
                }
            }
        }

        // delete the page
        const pageDeleted = await Page.findByIdAndDelete(pageId);
        if (!pageDeleted) {
            return {
                resStatus: 500,
                resMessage: {
                    "message": "Failed to delete page"
                }
            }
        }

        // remove the pageid from the user page array 
        user.pages.pull(page._id);
        await user.save();

        return {
            resStatus: 200,
            resMessage: {
                "message": "Page deleted"
            }
        }

    } catch (err) {
        console.log(err);
        return {
            resStatus: 500,
            resMessage: {
                "message": "Internal server error"
            }
        }
    }
}
