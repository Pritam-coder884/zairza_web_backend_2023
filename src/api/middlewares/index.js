const auth=require("./auth");
const notFound=require("./notFound")
const errorHandlerMiddleware=require("./errorHandler")


module.exports={
    auth,
    notFound,
    errorHandlerMiddleware
}