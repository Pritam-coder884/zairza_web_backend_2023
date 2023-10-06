const { User,Zencode } = require("../models");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {sendingEmail }= require('../services/nodemailer');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { findOne, findOneAndUpdate } = require("../models/zencode");

const createUser = async (req, res, next) => {
 try{
  const {
    name,
    regdno,
    email,
    password,
    phone,
    isZairzaMember,
    yearOfPassout
  } = req.body;



  //password hashing
  const salt = bcrypt.genSaltSync(10);
  const bcrypt_password = bcrypt.hashSync(password, salt);

  let lastZenCode=await Zencode.findOne();

  if(!lastZenCode){
     lastZenCode=new Zencode({num:0});
  }

  lastZenCode.num=lastZenCode.num+1;

  let tempVal=lastZenCode.num;

  let digit=0;

  while(tempVal>0){
     tempVal=tempVal/10;
     digit++;
    //  tempVal=tempVal%10;
  }

  let NewZenCode

  if(digit==1){
    NewZenCode="Z202300"+toString(lastZenCode);
  }else if(digit==2){
    NewZenCode="Z20230"+toString(lastZenCode);
  }else if(digit==3){
    NewZenCode="Z2023"+toString(lastZenCode);
  }

  const newUser=new User({
    name,
    regdno,
    email,
    password : bcrypt_password,
    phone,
    isZairzaMember,
    yearOfPassout,
    zenCode:NewZenCode,
  })
  const userEmail=newUser.email;
  const createUser = await newUser.save();
  await lastZenCode.save();
  res.status(200).send(createUser);
  // sendingEmail({userEmail});

 }catch(error){
  res.status(500).send(error.message);
  // next(error);
 }

};

const getAllUser = async (req, res, next) => {
  try {
    const getUsers = await User.find();
    res.status(200).send(getUsers);
  } catch (error) {
    // res.status(500).send({ message: "internal server error" });
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
  
    const oldUser = await User.findOne({ email })
    if (!oldUser) {
      throw new UnauthenticatedError('Mail Id is not Registered');
    }
   
    if (await bcrypt.compare(password, oldUser.password)) {
      const token = jwt.sign({email: oldUser.email, name: oldUser.name}, `${process.env.JWT_SECRET_KEY}`)
  
      if (res.status(201)) {
        return res.status(201).send({token :  token })
      } 
      else {
        throw new UnauthenticatedError('Invalid Credentials')
      }
    }
    res.status(401).send({message : "Wrong Password"});
  } catch (error) {
    // res.status(500).send(error.message);
    next(error);
  }
}


module.exports = {
  createUser,
  getAllUser,
  loginUser,
};



