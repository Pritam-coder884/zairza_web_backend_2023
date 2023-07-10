const dotenv=require("dotenv");
const path=require("path");
const joi=require("joi");

/* Joi allows us to create blueprints of Javascript objects that ensure that we process and ultimately accept accurate data.

How To Use Joi for Node API Schema Validation : 
-> Create validation schema for the request data parameters.
-> Handle validation errors and give appropriate feedback.
-> Create a middleware to intercept and validate requests.

*/


dotenv.config({path:path.join(__dirname,"../../.env")});

const envVarsSchema=joi.object().keys({
    NODE_ENV:joi.string().valid("production","development","test").required(),
    PORT:joi.number().default(5000),
    MONGODB_URL:joi.string().required().description("Mongodb URL"),

}).unknown();


const {value:envVars,error}=envVarsSchema
.prefs({
    errors:{label:"key"}
})
.validate(process.env);


module.exports={
    env:envVars.NODE_ENV,
    port:envVars.PORT,
    mongoose:{
        url:envVars.MONGODB_URL+(envVars.NODE_ENV==="test" ? "-test":""),
    }
}



