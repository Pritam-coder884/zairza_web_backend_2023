const express=require("express");
const route=express.Router();
const {UserController}=require("../controllers");

route.post("/create/user",UserController.createUser);
route.get("/get/user",UserController.getAllUser);
route.post("/login/user",UserController.loginUser);

module.exports=route;
