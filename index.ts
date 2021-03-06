import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
const mongoose = require("mongoose");
import bodyParser from "body-parser";

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config/keys");
var cors = require("cors");

const bootstrap = async () => {
	try {
		await mongoose.connect(MONGODB, {
			useNewUrlParser: true,
		});
		console.log("mongo connected");
		const pubsub = new PubSub();
		const app = express();
		app.set("trust proxy", 1);
		app.use(
			cors({
				origin: "https://awesome-neumann-6b754b.netlify.app",
				credentials: true,
			})
		);

		const PORT = process.env.PORT || 5000;

		app.use(bodyParser.json());
		const surveyRouter = require("./routes/surveyRoutes")(app);

		app.listen(PORT, () => console.log(`[App]: listening on port ${PORT}`));

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			playground: true,
			context: ({ req }) => ({ req, pubsub }),
			introspection: true,
		});

		server.applyMiddleware({ app, cors: false });
	} catch (e) {
		console.log(e);
	}
};

bootstrap();
