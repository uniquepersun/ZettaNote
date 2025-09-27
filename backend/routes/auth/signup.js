import bcrypt from "bcryptjs";

import User from "../../models/User.js";
import { genToken } from "../../util/token.js";

export default async function signup(req) {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const inputErrors = await validateInput(name, email, password, confirmPassword);
        if (inputErrors) {
            return {
                resStatus: 400,
                resMessage: {
                    "Input errors": inputErrors
                } 
            };
        }

        const hashedPass = await bcrypt.hash(password, 18);
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPass
        });

        await newUser.save();
        const token = genToken(newUser);

        return {
            resStatus: 200,
            resMessage: {
                "Message": "Signed up",
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

async function validateInput(name, email, password, confirmPassword) {
    let error = false;
    let errors = [];

    // check for empty strings
    if(isEmptyOrWhitespace(name)) { error = true; errors.push("Name cannot be empty"); }
    if(isEmptyOrWhitespace(email)) { error = true; errors.push("Email cannot be empty"); }
    if(isEmptyOrWhitespace(password)) { error = true; errors.push("Password cannot be empty"); }

    // validate input 
    if (password !== confirmPassword) { error = true; errors.push("Passwords do not match"); }
    if (!isValidEmail(email)) { error = true; errors.push("Invalid email"); }
    
    const emailInUse = await User.findOne({email:email});
    if (emailInUse) { error = true; errors.push("Email in use"); }

    if (error) {
        return errors;
    } else {
        return null;
    }
}


function isEmptyOrWhitespace(str) {
  return !str || str.trim().length === 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
