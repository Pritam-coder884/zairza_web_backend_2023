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
  } = req.body;

  //password hashing
  const salt = bcrypt.genSaltSync(10);
  const bcrypt_password = bcrypt.hashSync(password, salt);

  let lastZenCode=await Zencode.findOne();

  if(!lastZenCode){
     lastZenCode=new Zencode({num:0});
  }

  lastZenCode.num=lastZenCode.num+1;
  
  let NewZenCode;

  if(lastZenCode.num<10){
    NewZenCode=`Z202300${lastZenCode.num}`;
  }else if(lastZenCode.num<100){
    NewZenCode=`Z20230${lastZenCode.num}`;
  }else if(lastZenCode.num<1000){
    NewZenCode=`Z2023${lastZenCode.num}`;
  }

  const newUser=new User({
    name,
    regdno,
    email,
    password : bcrypt_password,
    zenCode : NewZenCode,
  })

  await newUser.save();
  await lastZenCode.save();

  res.status(200).send(newUser);
 }catch(error){
    res.status(500).send(error.message);
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



