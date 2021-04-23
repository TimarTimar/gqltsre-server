import { AuthTypes } from "../../types/AuthTypes";
import { MyContext } from "../../types/Mycontext";
import { UserSchemaTypes } from "../../types/SchemaTypes/UserSchemaTypes";

const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config/keys");
const checkAuth = require("../../util/check-auth");
const { findById } = require("../../models/User");

function generateToken(user: UserSchemaTypes) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: "1h" }
	);
}

module.exports = {
	Query: {
		async me(_: any, __: any, context: MyContext) {
			console.log("me");
			const user = checkAuth(context);
			if (user) {
				try {
					const res = await User.findById(user.id);
					if (res) {
						return res;
					} else {
						throw new Error("user not found");
					}
				} catch (err) {
					throw new Error(err);
				}
			}
		},
	},
	Mutation: {
		async login(_: any, { username, password }: UserSchemaTypes) {
			console.log("login");
			const { valid, errors } = validateLoginInput(username, password);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const res = await User.findOne({ username });

			if (!res) {
				errors.general = "User not found";
				throw new UserInputError("User not found", { errors });
			} else {
				const match = await bcrypt.compare(password, res.password);
				if (!match) {
					errors.general = "Wrong credentials";
					throw new UserInputError("Wrong credentials", { errors });
				}
			}

			const token = generateToken(res);
			return {
				...res._doc,
				id: res._id,
				credits: res.credits,
				token,
			};
		},

		async register(
			_: any,
			{
				registerInput: { username, email, password, confirmPassword },
			}: { registerInput: AuthTypes }
		) {
			console.log("register");
			// Validate user data
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			// Make sure user doesnt already exist

			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("Username is taken", {
					errors: {
						username: "This username is already taken",
					},
				});
			}

			//Hash password and create an auth token

			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
				credits: 0,
			});

			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				credits: res.credits,
				token,
			};
		},
		async pay5usd(_: any, token: { token: string }, context: MyContext) {
			console.log("pay5usd");
			const user = checkAuth(context);
			console.log("token", token);

			const { credits } = await User.findById(user.id);
			const newCredits = credits + 5;

			const myToken = Object.values(token);

			if (user) {
				console.log(token, 22);
				const charge = await stripe.charges.create({
					amount: 5000,
					currency: "usd",
					source: myToken[0],
					description: "$5 for 5 credits",
				});

				const editedUser = {
					credits: newCredits,
				};

				try {
					const res = await User.findByIdAndUpdate(user.id, editedUser, {
						new: true,
					});
					if (res) {
						return res;
					}
					throw new UserInputError(
						"Could not find this user with the given ID"
					);
				} catch (err) {
					throw new Error(err);
				}
			}
		},
	},
};
