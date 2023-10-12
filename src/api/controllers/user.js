const { readFile } = require('node:fs/promises')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User , Zencode} = require("../models");
// const {sendingEmail }= require('../services/nodemailer');
const {UnauthenticatedError } = require('../errors');
const config = require('../../config/config')
const path = require('path')

const createUser = async (req, res, next) => {
 try{
  // console.log(req.files);
  const {
    name,
    regdno,
    email,
    password,
  } = req.body;

  const existinguser = await User.findOne({email});
  if(existinguser){
    return res.status(404).send({msg: "User already exists"});
  }

  const ereg = await User.findOne({regdno});
  if(ereg){
    return res.status(404).send({msg: "User already exists"})
  }

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
    // image_path : req.files[0]?.path.split('\\')[2]
  })

  await newUser.save();
  await lastZenCode.save()
  res.status(201).send(newUser);
 }catch(error){
    console.log(error)
    next(error)
  }
}

// const getUserImage = async(req,res,next) => {
//   try {
//     const user = await User.findOne({email : req.body.email})

//     if(!user){
//       return res.status(404).send('Not found')
//     }

//     const location = path.join(__dirname,`..\\..\\..\\public\\images\\`, user.image_path)
//     const file = await readFile(location)
//     res.contentType('image/jpeg')
//     res.send(file);
//   } catch (error) {
//     next(error)
//   }
// }

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
    await getUser.populate('events', 'event_name event_description event_date event_venue')
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



