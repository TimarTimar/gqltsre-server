const { gql } = require("apollo-server");

module.exports = gql`
	type Survey {
		id: ID!
		title: String!
		subject: String!
		body: String!
		state: String!
		recipients: [Recipient]
		username: String!
		createdAt: String!
		dateSent: String
		yes: Int!
		no: Int!
	}
	type Recipient {
		email: String!
		responded: Boolean!
	}

	type Post {
		id: ID!
		body: String!
		username: String!
		createdAt: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}
	type Comment {
		id: ID!
		createdAt: String!
		username: String!
		body: String!
	}
	type Like {
		id: ID!
		createdAt: String!
		username: String!
	}
	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
		credits: Int!
	}
	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}
	input SurveyInput {
		title: String!
		subject: String!
		body: String!
		recipients: String!
	}
	type Query {
		me: User
		getPosts: [Post]
		getPost(postId: ID!): Post
		getSurveys: [Survey]
		getSurvey(surveyId: ID!): Survey
		getSurveysByUser: [Survey]
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!

		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: ID!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!

		createSurvey(surveyInput: SurveyInput): Survey!
		createSurveyAndSend(surveyInput: SurveyInput): User!
		deleteSurvey(surveyId: ID!): String!
		editSurvey(surveyInput: SurveyInput, surveyId: ID!): Survey
		editSurveyAndSend(surveyInput: SurveyInput, surveyId: ID!): Survey
		quickSendSurvey(surveyId: ID!): Survey!

		pay5usd(token: String!): User!
	}
	type Subscription {
		newPost: Post!
	}
`;
