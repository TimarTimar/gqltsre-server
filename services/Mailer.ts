import { SurveySchemaTypes } from "../types/SchemaTypes/SurveySchemaTypes";

const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

//TODO

class Mailer extends helper.Mail {
	constructor(
		{ subject, recipients }: SurveySchemaTypes,
		content: HTMLElement
	) {
		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email("tamasbelinszky@gmail.com");
		this.subject = subject;
		this.body = new helper.Content("text/html", content);
		this.recipients = this.formatAddresses(recipients);

		this.addContent(this.body);
		this.addClickTracking();
		this.addRecipients();
	}

	// TODO:
	formatAddresses(recipients: { email: string; responded: boolean }[]) {
		if (recipients) {
			return recipients.map(({ email }) => {
				return new helper.Email(email);
			});
		} else {
			return;
		}
	}

	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}

	addRecipients() {
		const personalize = new helper.Personalization();

		this.recipients.forEach(
			(recipient: { email: string; responded: boolean }[]) => {
				personalize.addTo(recipient);
			}
		);
		this.addPersonalization(personalize);
	}

	async send() {
		const request = this.sgApi.emptyRequest({
			method: "POST",
			path: "/v3/mail/send",
			body: this.toJSON(),
		});

		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;
