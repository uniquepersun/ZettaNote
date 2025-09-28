import Page from "../../models/Page.js";
import { verifyToken } from "../../util/token.js";

export async function getPage(req) {
    try {
        const { token, pageId } = req.body;

        // verify user token
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "User not logged in"
                }
            }
        }

        // find page in db
        const page = await Page.findById(pageId);
        if (!page) {
            return {
                resStatus: 404,
                resMessage: {
                    "Error": "Page not found"
                }
            }
        }

        // check if user owns the page
        if (!page.owner.equals(user._id)) {
            return {
                resStatus: 403,
                resMessage: {
                    "Error": "Not authorized"
                }
            }
        }

        // return page to user
        return {
            resStatus: 200,
            resMessage: {
                "Page": page
            }
        };

    } catch(err) {
        console.log(err);
        return {
            resStatus: 500,
            resMessage: {
                "Error": "Internal server error"
            }
        }
    }
}

// returns a list of the users page names and ids
export async function getPages(req) {
    try {
        const { token } = req.body;

        // verify user is logged in
        const user = await verifyToken(token);
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "User not logged in"
                }
            }
        }

        // return pages to user
        let data = [];
        for (const id of user.pages) {
            const page = await getPageNameAndId(id);
            if (page !== null) {
                data.push(page);
            }
        } 

        return {
            resStatus: 200,
            resMessage: {
                "Pages": data
            }
        }

    } catch (err) {
        console.log(err);
        return {
            resStatus: 500,
            resMessage: {
                "Error": "Internal server error"
            }
        }
    }
}

// returns the name and the id of the page as a object
async function getPageNameAndId(pageId) {
    const page = await Page.findById(pageId);
    
    if (!page) {
        return null;
    }

    return {
        name: page.pageName,
        id: page._id
    };
}
