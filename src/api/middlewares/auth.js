const jwt=require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const config = require('../../config/config')

const auth = async (req, res , next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Authentication invalid')
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const {email,name} = jwt.verify(token, config.jwt_secret)
      req.auth={email,name};
      next();
    } catch (error) {
      next(error)
    }
}

module.exports = auth