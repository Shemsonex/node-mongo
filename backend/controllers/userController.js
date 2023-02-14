import { schema } from '@hapi/joi/lib/compile.js'
import asyncHandler from 'express-async-handler'
//import cloudinary from 'cloudinary').v2;
import {User,validateUser, } from '../models/userModel.js'
import authenticate from '../middleware/authenticate.js'
//const bcrypt = require('bcrypt')


//Get Single user
const getUser = asyncHandler(async (req, res) => {
  try {
		const user = await User.findOne({ _id: req.params.id })
		res.json(user)
	} catch {
		res.status(404).json({ error: "User doesn't exist!" })
	}
});

//Get ALL users
const getUsers = asyncHandler(async (req, res) => {
//  console.log(req.body);
  if(req.userRole !== 'admin'){
    res.status(401).json({error : 'Unauthorised access. Reserved for admins'});
  }
  const users = await User.find()
  res.status(200).json(users);
});

//Set user
const setUser = asyncHandler(async (req, res) => {
     
     const { error } = validateUser(req.body);
     if (error) {
        res.status(400)
        throw new Error(error.details[0].message)
     }
     User.findOne({ email: req.body.email }, (error, existingUser) => {
      if (error) return res.status(500).send(error.message);
      if (existingUser) return res.status(409).json({error : 'Email already exists'});
     });
     User.findOne({ username: req.body.username }, (error, existingUser) => {
      if (error) return res.status(500).send(error.message);
      if (existingUser) return res.status(409).json({error : 'Username already exists'});
     });
     const user = new User({
        names : req.body.names,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
      })

user.save((err) => {
  if (err) {
    // Handle the error
    res.status(400).json({error : "User not saved"});

  } else {
    // User credentials have been saved
    res.status(201).json({message: "User created successfully !", user});
  }
});
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
 
  const user = await User.findById(req.params.id)

  if(!user){
    res.status(404)
    throw new Error("User not found")   
}
 if(req.userRole !== 'admin' && req.userId !== req.params.id){
    res.status(401).json({error : "Unauthorised access. You can only update your own account."});
  }
User.findOne({ email: req.body.email } || {username: req.body.username}, (error, existingUser) => {
  if (error) return res.status(500).send(error.message);
  if (existingUser) return res.status(400).json({error : 'Email already exists'});
 });
 const { error } = validateUser(req.body);
if (error) {
   res.status(400)
   throw new Error(error.details[0].message)
}
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
  })
  res.status(200).json({message : 'User updated successfully', updatedUser});
});
//Delete Single User
const deleteUser = asyncHandler(async (req, res) => {
  if(req.userRole !== 'admin' && req.userId !== req.params.id){
    res.status(401).json({error : "Unauthorised access. You can only delete your own account."});
  }
  const user = await User.findById(req.params.id)

  if(!user){
    res.status(404).json({error : 'User not found'})
  }
  await user.remove()
  res.status(200).json({
    id: req.params.id
  });
});

//Delete All Users
const deleteUsers = asyncHandler(async (req, res) => {
  if(req.userRole !== 'admin'){
    res.status(401).json({error : 'Unauthorised access. Reserved for admins'});
  }
    const user = await User.find()
    if(!user){
      res.status(404)
      console.log('No Users are found');
    }
      user.forEach(element => {
         element.remove()
      });
   // await user.deleteMany()
    res.status(200).json({
      user,
    });
  });

export {
  getUsers,
  getUser,
  setUser,
  updateUser,
  deleteUser,
  deleteUsers,
};
