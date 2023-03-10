import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'

export const authenticate = (req, res, next) => {
  const rawToken = req.header('Authorization');

  if (!rawToken) {    
    return res.status(400).json({ error: 'Access denied. No token provided' });
  }

  try {
    const token = rawToken.split(' ')[1]
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded._id;
    req.userRole = decoded.role;
    // console.log(decoded)
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

export const authenticateUser = asyncHandler(async (req, res) => {
  User.findOne({ email: req.body.email },async (err, user) => {
    if (err) return res.status(400).json(err);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({Error: 'Password is incorrect'});
    }else{
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).json({ message: 'User authenticated' });
    }
  
  });
})  

export default {authenticate, authenticateUser};