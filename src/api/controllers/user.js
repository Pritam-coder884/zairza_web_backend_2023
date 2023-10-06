const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User , Zencode} = require("../models");
// const {sendingEmail }= require('../services/nodemailer');
const {UnauthenticatedError } = require('../errors');
const config = require('../../config/config')

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

  let lastZenCode = await Zencode.findOne();

  if (!lastZenCode) {
      lastZenCode = new Zencode({ num: 0 });
  }
  lastZenCode.num = lastZenCode.num + 1;

  const NewZenCode = await User.generateZencode(lastZenCode.num)

  const newUser=new User({
    name,
    regdno,
    email,
    password : bcrypt_password,
    zencode : NewZenCode,
  })

  await newUser.save();
  await lastZenCode.save()
  res.status(201).send(newUser);
 }catch(error){
    next(error)
 }
};

const getAllUser = async (req, res, next) => {
  try {
    const getUsers = await User.find();
    res.status(200).send(getUsers);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req,res,next) => {
  try {
    const getUser = await User.findOne({email : req.auth.email});
    await getUser.populate('events', 'event_name event_description')
    res.status(200).send(getUser)
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
  
    const oldUser = await User.findOne({ email })
    if (!oldUser) {
      throw new UnauthenticatedError('Mail Id is not Registered');
    }
   
    if (await bcrypt.compare(password, oldUser.password)) {
      const token = jwt.sign({email: oldUser.email, name: oldUser.name}, `${config.jwt_secret}`)
  
      if (res.status(200)) {
        res.status(200).send({token :  token })
      } 
      else {
        throw new UnauthenticatedError('Invalid Credentials')
      }
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createUser,
  getAllUser,
  loginUser,
  getUser
};



