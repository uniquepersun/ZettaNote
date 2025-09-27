import bcrypt from "bcryptjs";
import { genToken } from "../../util/token.js";
import User from "../../models/User.js";

export default async function login(req) {
    try {
        const { email, password } = req.body;


        // check if email is in db
        const user = await User.findOne({email:email});
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Invalid email or password"
                }
            };
        }

        // match password to password in DB
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Invalid email or password"
                }
            }
        }

        // gen token and return to user
        const token = genToken(user);
        return {
            resStatus: 200,
            resMessage: {
                "Message": "Logged in",
                "token": token
            }
        }

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
