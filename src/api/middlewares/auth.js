const jwt=require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

// const authenticationJWT = async (req, res , next) => {
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthenticatedError('Authentication invalid')
//     }
  
//     const token = authHeader.split(' ')[1];
//     console.log(token);
  
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET)
//       const {email,username,phone,isZairzaMember}=payload;
//       req.auth={email,username,phone,isZairzaMember};
//       next();
//     } catch (error) {
//       throw new UnauthenticatedError('Authentication invalid')
//     }
// }

// const authenticationGoogleandGithub = (req,res,next) => {
//   if(req.isAuthenticated()){
//     next()
//   }
// }

const authenticationAll = (req,res,next) => {
  const authHeader = req.headers.authorization
  if(req.isAuthenticated() ){
    next()
  }
  else if(!req.isAuthenticated() && !authHeader)
  {
    throw new UnauthenticatedError('Authentication invalid')
  }
  else{
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Authentication invalid')
    }
  
    const token = authHeader.split(' ')[1];
    console.log(token);
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      const {email,username,phone,isZairzaMember}=payload;
      req.auth={email,username,phone,isZairzaMember};
      next();
    } catch (error) {
      throw new UnauthenticatedError('Authentication invalid')
    }
  }  
}

module.exports={
  // authenticationJWT,
  // authenticationGoogleandGithub,
  authenticationAll
};