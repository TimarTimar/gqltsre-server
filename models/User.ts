import { model, Schema } from "mongoose";

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
	credits: { type: Number, default: 0 },
});

module.exports = model("User", userSchema);
