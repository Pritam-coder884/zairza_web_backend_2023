require("dotenv").config();
const express=require("express");
const cors=require("cors");
const xss=require("xss-clean");
const mongoSanitize=require("express-mongo-sanitize");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");


// use of session and passport.js

const session = require('express-session');
const passport = require('passport');
require('./api/helpers/passport')
const {userRoute}=require("./api/routes");
const {notFound,errorHandlerMiddleware}=require("./api/middlewares");

const app=express();

if(config.env !== "test"){
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// parsing json data
app.use(express.json());


app.use(session({
	secret : "zairza",
	// resave : true,
	// saveUninitialized : true,
	// cookie : {secure : false}
  }))
app.use(passport.initialize())
app.use(passport.session())

// parsing urlencoded data
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());

app.use("/",userRoute);


// Welcome route to zairza website
app.get("/", async (req, res, next) => {
	return res.status(httpStatus.OK).json({
		code: httpStatus.OK,
		status: httpStatus[200],
		message: "Welcome to zairza website",
		data: null,
	});
});

// require("./api/routes/index")(app);


// handle error
app.use(errorHandlerMiddleware);
app.use(notFound);

module.exports = { app };


