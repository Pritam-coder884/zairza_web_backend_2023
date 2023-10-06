const express=require("express");
const route=express.Router();
const {EventController}=require("../controllers");
const {auth} = require("../middlewares")

route.post("/create/event",auth,EventController.createEvent);
route.get("/getall/event",auth,EventController.getEvents);
route.patch("/enroll/event",auth,EventController.enrollEvent);

module.exports=route;