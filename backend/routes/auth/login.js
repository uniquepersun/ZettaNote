import bcrypt from "bcryptjs";
import { genToken } from "../../util/token.js";
import User from "../../models/User.js";
import validatePass from "../../util/validatePass.js";

export default async function login(req) {
    try {
        const { email, password } = req.body;

        // check if email is in db
        const user = await User.findOne({email:email});
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "message": "Invalid email or password"
                }
            };
        }
        //validating password
        const validation = validatePass(password);
        if(validation.resStatus != 200){
            return validation
        }

        // match password to password in DB
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return {
                resStatus: 400,
                resMessage: {
                    "message": "Invalid email or password"
                }
            }
        }

        // gen token and return to user
        const token = genToken(user);
        return {
            resStatus: 200,
            resMessage: {
                "message": "Logged in",
                "token": token
            }
        }

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
