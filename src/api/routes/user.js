const express=require("express");
const route=express.Router();
const {UserController}=require("../controllers");
const {auth} = require("../middlewares")

route.post("/create/user",UserController.createUser);
route.post("/login/user",UserController.loginUser);
route.get("/getall/user",auth,UserController.getAllUser);
route.get("/get/user",auth,UserController.getUser);

module.exports=route;
