const express=require("express");
const route=express.Router();
const {UserController}=require("../controllers");
const {authentication}=require("../middlewares")

route.post("/create/user",UserController.createUser);
route.get("/get/users",authentication.authenticationAll,UserController.getAllUser);
route.get("/get/user",authentication.authenticationAll, UserController.getUser);
route.post("/login/user",UserController.loginUser);

module.exports=route;
