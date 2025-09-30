import Page from "../../models/Page.js";
import User from "../../models/User.js";
import { verifyToken } from "../../util/token.js";

export default async function sharePage(req) {
    try {
        const { token, pageId, userEmail, giveWritePermission } = req.body;

        // verify user is logged in
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "User not logged in"
                }
            };
        }

        // find page in db
        const page = await Page.findById(pageId);
        if (!page) {
            return {
                resStatus: 404,
                resMessage: {
                    "Error": "Page not found"
                }
            };
        }

        // check user owns the page
        if (!page.owner.equals(user._id)) {
            return {
                resStatus: 403,
                resMessage: {
                    "Error": "Not authorized"
                }
            }
        }

        // find shared user account in db
        const sharedUser = await User.findOne({ email: userEmail });
        if (!sharedUser) {
            return {
                resStatus: 404,
                resMessage: { Error: "User does not exist" }
            };
        }

        // check if already shared
        let pageAlreadyShared = false;
        page.sharedTo.forEach(id => {
            if (id.equals(sharedUser._id)) {
                pageAlreadyShared = true;
            }
        })

        if (pageAlreadyShared) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Page already shared with this page"
                }
            }
        }

        // add user to page.sharedTo and page.usersWithWritePermission if needed
        page.sharedTo.push(sharedUser._id);
        if (giveWritePermission) {
            page.usersWithWritePermission.push(sharedUser._id);
        }
        await page.save();

        // add page to user's sharedPages
        sharedUser.sharedPages.push(page._id);
        await sharedUser.save();

        return {
            resStatus: 200,
            resMessage: {
                "Message": "Successfully shared with this user"
            }
        }

    } catch (err) {
        console.error(err);
        return {
            resStatus: 500,
            resMessage: {
                "Error": "Internal server error"
            }
        };
    }
}