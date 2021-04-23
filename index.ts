import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
const mongoose = require("mongoose");
import bodyParser from "body-parser";

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config/keys");

const bootstrap = async () => {
	try {
		await mongoose.connect(MONGODB, {
			useNewUrlParser: true,
		});
		console.log("mongo connected");
		const pubsub = new PubSub();
		const app = express();

		const PORT = process.env.PORT || 5000;

		app.use(bodyParser.json());
		const surveyRouter = require("./routes/surveyRoutes")(app);

		app.listen(PORT, () => console.log(`[App]: listening on port ${PORT}`));

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			playground: true,
			context: ({ req }) => ({ req, pubsub }),
		});

		server.applyMiddleware({ app });
	} catch (e) {
		console.log(e);
	}
};

bootstrap();
