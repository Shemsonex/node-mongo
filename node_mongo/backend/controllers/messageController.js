const { schema } = require('@hapi/joi/lib/compile');
const asyncHandler = require('express-async-handler')
//const axios = require('axios');
const {Message,validateMessage} = require('../models/messageModel')

//Get Single user
const getMessage = asyncHandler(async (req, res) => {
  try {
		const message = await Message.findOne({ _id: req.params.id })
		res.send(message)
	} catch {
		res.status(404)
		res.send({ error: "Message doesn't exist!" })
	}
});

//Get users
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find()
  res.status(200).json(messages);
});

//Set user
const setMessage = asyncHandler(async (req, res) => {
     
     const { error } = validateMessage(req.body);
     if (error) {
        res.status(400)
        throw new Error(error.details[0].message)
     }

     const message = await Message.create({
        names : req.body.names,
        email : req.body.email,
        content : req.body.content,
      })
   
     res.status(201).json(message);
});
//Update Posts
const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id)

  if(!message){
    res.status(404)
    throw new Error("Message is not found")   
}

  const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
  })
  res.status(200).json(updatedMessage);
});
//Delete Single message
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id)

  if(!message){
    res.status(404)
    throw new Error('Message not found');
  }
  await message.remove()
  res.status(200).json({
    id: req.params.id
  });
});

//Delete All messages
const deleteMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find()
    if(!messages){
      res.status(404)
      throw new Error('Message not found');
    }
      messages.forEach(element => {
         element.remove()
      });
    res.status(200).json({
      messages,
    });
  });


module.exports = {
  getMessages,
  getMessage,
  setMessage,
  updateMessage,
  deleteMessage,
  deleteMessages
};
