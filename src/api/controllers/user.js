const { User } = require("../models");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {sendingEmail }= require('../services/nodemailer');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const createUser = async (req, res, next) => {
 try{
  const {
    email,
    username,
    password,
    phone,
    isZairzaMember,
    yearOfPassout
  } = req.body;

  if(!email || !username || !password || !phone || !isZairzaMember || !yearOfPassout){
    throw new BadRequestError('Please provide all the details');
  }

  //password hashing
  const salt = bcrypt.genSaltSync(10);
  const bcrypt_password = bcrypt.hashSync(password, salt);

  // const passportUser=  await User.findOne({email})
  // if(passportUser && !passportUser.password){
  //   passportUser.password = bcrypt_password,
  //   passportUser.phone=phone,
  //   passportUser.isZairzaMember=isZairzaMember,
  //   passportUser.yearOfPassout=yearOfPassout,
  //   passportUser.username=username
  //   await passportUser
  // }

  const newUser=new User({
    email,
    username,
    password : bcrypt_password,
    phone,
    isZairzaMember,
    yearOfPassout
  })
  const userEmail=newUser.email;
  const createUser = await newUser.save();
  res.status(200).send({user : createUser});
  // sendingEmail({userEmail});

 }catch(error){
  res.status(500).send(error.message);
  // next(error);
 }

};

const getAllUser = async (req, res, next) => {
  try {
    const getUsers = await User.find();
    res.status(200).send({user : getUsers});
  } catch (error) {
    // res.status(500).send({ message: "internal server error" });
    next(error);
  }
};

const getUser = async (req,res,next) => {
  console.log("req.auth : ", req.auth);
  console.log("req.user : ", req.user);
  try{
    if(req.user){
      res.status(200).send({user : req.user})
    }
    else{
      res.status(200).send({user : req.auth})
    }
  }
  catch(error){
    next(error);
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
  
    const oldUser = await User.findOne({ email })
    if (!oldUser) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
   
    if (await bcrypt.compare(password, oldUser.password)) {
      const token = jwt.sign({email: oldUser.email, username: oldUser.username,phone: oldUser.phone,isZairzaMember:oldUser.isZairzaMember}, `${process.env.JWT_SECRET}`)
  
      if (res.status(201)) {
        return res.status(201).send({token :  token })
      } 
      else {
        throw new UnauthenticatedError('Invalid Credentials')
      }
    }
    res.status(401).send({message : "Invalid Credentials"})
  } catch (error) {
    // res.status(500).send(error.message);
    next(error);
  }
}


module.exports = {
  createUser,
  getAllUser,
  getUser,
  loginUser,
};



