import { Application, Request, Response } from "express";
import _ from "lodash";
import { Path } from "path-parser";
import { URL } from "url";

const Survey = require("../models/Survey");

module.exports = (app: Application) => {
	app.post("/api/surveys/webhooks", (req: Request, res: Response) => {
		const p = new Path("/api/surveys/:surveyId/:choice");
		_.chain(req.body)
			.map(({ email, url }) => {
				//return null if cant extract these from url
				console.log(email);
				console.log(url);
				if (!email || !url) {
					return;
				}
				const match = p.test(new URL(url).pathname);
				console.log(match);
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice };
				}
			})
			//remove undefined elements
			.compact()
			.uniqBy(["email", "surveyId"])
			.each(async ({ surveyId, email, choice }) => {
				console.log("update Survey");
				await Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false },
						},
					},
					{
						$inc: { [choice]: 1 },
						$set: { "recipients.$.responded": true },
						lastResponded: new Date(),
					}
				).exec();
			})
			.value();

		res.send({});
	});

	app.get("/api/surveys/:surveyId/:choice", (req, res) => {
		res.send("Thanks for voting");
	});
};
