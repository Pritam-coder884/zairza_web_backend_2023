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
    name,
    password,
    phone,
    isZairzaMember,
    yearOfPassout
  } = req.body;



  //password hashing
  const salt = bcrypt.genSaltSync(10);
  const bcrypt_password = bcrypt.hashSync(password, salt);

  const newUser=new User({
    email,
    name,
    password : bcrypt_password,
    phone,
    isZairzaMember,
    yearOfPassout
  })
  const userEmail=newUser.email;
  const createUser = await newUser.save();
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
      throw new UnauthenticatedError('Invalid Credentials')
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
    res.status(401).send({message : "Invalid Credentials"})
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



