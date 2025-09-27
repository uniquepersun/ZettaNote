import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { genToken } from "../../util/token.js";
import validatePass from "../../util/validatePass.js";

export default async function changePassword(req) {
    try {
        const { email, password, newPassword, confirmNewPassword } = req.body;
        
        //validating new password
        const validation = validatePass(newPassword);
        if(validation.resStatus != 200){
            return validation;
        }

        // check if passwords match
        if (newPassword !== confirmNewPassword) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Passwords do not match"
                }
            };
        }

        // check if password is empty
        if (isEmptyOrWhitespace(newPassword)) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Password cannot be empty"
                }
            };
        } 

        // check if user exists and is given the correct password
        const user = await User.findOne({email:email});
        if (!user) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Email or password invalid"
                }
            }
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return {
                resStatus: 400,
                resMessage: {
                    "Error": "Email or password invalid"
                }
            }
        }

        // hash new password and save it to DB
        const newPassHashed = await bcrypt.hash(newPassword, 18);
        user.password = newPassHashed;
        await user.save();

        // gen token and return it to user
        const token = genToken(user);

        return {
            resStatus: 200,
            resMessage: {
                "Message": "Password successfully changed",
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

function isEmptyOrWhitespace(str) {
  return !str || str.trim().length === 0;
}
