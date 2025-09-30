import bcrypt from "bcryptjs";
import validatePass from "../../util/validatePass.js";
import User from "../../models/User.js";
import { genToken } from "../../util/token.js";
import { z } from "zod";

export default async function signup(req) {
  try {
	// Zod validation
	const signupSchema = z.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(1, "Password is required"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	});

	const parseResult = signupSchema.safeParse(req.body);

	if (!parseResult.success) {
		return {
			resStatus: 400,
			resMessage: {
				message: JSON.parse(parseResult.error).map((err)=>err.message).join(", "),
			},
		};
	}

    const { name, email, password, confirmPassword } = parseResult.data;
	// checking same password and confirm password
	if (password !== confirmPassword) {
	return {
		resStatus: 400,
		resMessage: {
			message: "Passwords do not match",
		},
	};
	}
	// checking user exists
	const emailInUse = await User.findOne({ email: email });
	if(emailInUse){
		return {
			resStatus: 400,
			resMessage: {
				message: "Email in use",
			},
		};
	}   

    // create new user object and store in DB
    const hashedPass = await bcrypt.hash(password, 18);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
    });

    await newUser.save();

    // gen token and return to user
    const token = genToken(newUser);

    return {
      resStatus: 200,
      resMessage: {
        "message": "Signed up",
        token: token,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      resStatus: 500,
      resMessage: {
        "message": "Internal server error",
      },
    };
  }
}
