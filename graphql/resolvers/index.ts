const userResolvers = require("./users");
const surveyResolvers = require("./surveys");

module.exports = {
	//Post modifier. Each time any query/mutation/subscription goes through, this will be applied.
	/*Post: {
		//parent all posts
		likeCount: (parent) => parent.likes.length,
		commentCount: (parent) => parent.comments.length,
	},*/
	Query: {
		...userResolvers.Query,
		...surveyResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...surveyResolvers.Mutation,
	},
	/*Subscription: {
		//websockets in the background actively listening NEW_POST events
		...postsResolvers.Subscription,
	},*/
};
