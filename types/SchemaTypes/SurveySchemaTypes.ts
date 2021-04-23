export interface SurveySchemaTypes {
	_id?: string;
	id: string;
	title?: string;
	subject?: string;
	body?: string;
	recipients: {
		email: string;
		responded: boolean;
	}[];

	username?: string;
	state?: "draft" | "sent";
	createdAt?: string;
	user?: string;
	no?: number;
	yes?: number;
	dateSent?: string;
}
