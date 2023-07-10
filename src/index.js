const {app}=require("./app");
const config=require("./config/config");
const logger=require("./config/logger");
const mongoose=require("mongoose");

let server;

server = app.listen(config.port, () => {
	logger.info(`Listening to port ${config.port}`);
});



// Connection with MongoDB Database

// const { MongoClient, ServerApiVersion } = require('mongodb');


// connection with Mongodb database
mongoose.set("strictQuery", false);
const uri = config.mongoose.url ;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected with Mongodb database");
  })
  .catch((error) => console.log(`${error}`));


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     logger.info("connected to MongoDB Database!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});
