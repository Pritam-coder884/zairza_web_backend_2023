const express=require("express");
const route=express.Router();
const {UserController}=require("../controllers");
const {auth, upload} = require("../middlewares")

route.post("/create/user",upload.any(),UserController.createUser);
route.post("/login/user",UserController.loginUser);
route.get("/getall/user",auth,UserController.getAllUser);
route.get("/get/user",auth,UserController.getUser);
route.get("/getimage/user",UserController.getUserImage);

module.exports=route;
