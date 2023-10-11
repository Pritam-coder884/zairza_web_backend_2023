const auth=require("./auth");
const notFound=require("./notFound")
const errorHandlerMiddleware=require("./errorHandler")
const upload = require('./multer')

module.exports={
    auth,
    notFound,
    errorHandlerMiddleware,
    upload
}