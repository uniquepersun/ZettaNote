import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import User from "../models/User.js";

export const genToken = (user) => {
    const token = jsonwebtoken.sign(
        {
            id: user._id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "8h" },
    );

    return token;
};

export const verifyToken = async (token) => {
    let decoded;
    let user;

    try {
        decoded = jsonwebtoken.verify(token, JWT_SECRET);
        user = await User.findOne({ email: decoded.email });
    } catch (err) {
        return null;
    }

    return user;
};
