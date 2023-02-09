const { schema } = require('@hapi/joi/lib/compile');
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2;
const {User,validateUser, } = require('../models/userModel')
const authenticate = require('../middleware/authenticate');
const bcrypt = require('bcrypt')


// CLOUDINARY Configuration 
cloudinary.config({
  cloud_name: "dir6akgf8",
  api_key: "558841897122288",
  api_secret: "DxV73zCbjvJl2kcgEbCLNMqTFKQ"
});

//SET PROFILE PICTURE
const setProfilePicture = asyncHandler(async (req, res) => { 
    // Save the image URL to your database for the user
    const picture = req.picture;
    if (!req.body.pictured) {
      return res.status(400).json({
        error: 'File field is missing in the request body'
      });
    }
    
    return res.json(req.pictured );
  });
//});

//Get Single user
const getUser = asyncHandler(async (req, res) => {
  try {
		const user = await User.findOne({ _id: req.params.id })
		res.send(user)
	} catch {
		res.status(404)
		res.send({ error: "User doesn't exist!" })
	}
});

//Get ALL users
const getUsers = asyncHandler(async (req, res) => {
  
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
     const user = new User({
        names : req.body.names,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
      })

user.save((err) => {
  if (err) {
    // Handle the error
    res.status(401).json({error : "User not saved"});

  } else {
    // User credentials have been saved
    res.status(201).json(user);
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
User.findOne({ email: req.body.email }, (error, existingUser) => {
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
  res.status(200).json(updatedUser);
});
//Delete Single User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if(!user){
    res.status(404)
    console.log('User not found');
  }
  await user.remove()
  res.status(200).json({
    id: req.params.id
  });
});

//Delete All Users
const deleteUsers = asyncHandler(async (req, res) => {
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

module.exports = {
  getUsers,
  getUser,
  setUser,
  updateUser,
  deleteUser,
  deleteUsers,
  setProfilePicture,
  //uploadOne,
};
