import { model, Schema } from "mongoose";

const surveySchema = new Schema({
	title: String,
	subject: String,
	body: String,
	recipients: [
		{
			email: String,
			responded: { type: Boolean, default: false },
		},
	],
	username: String,
	state: { type: String, default: "draft" },
	createdAt: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	no: { type: Number, default: 0 },
	yes: { type: Number, default: 0 },
	dateSent: String,
});

module.exports = model("Survey", surveySchema);
