import { schema } from '@hapi/joi/lib/compile.js'
import asyncHandler from 'express-async-handler'
import {Message,validateMessage} from '../models/messageModel.js'

//Get Single message
const getMessage = asyncHandler(async (req, res) => {
  // if(req.userRole !== 'admin' && req.userId !== req.params.id){
  //   res.status(403).json({error : "Unauthorised access. You can only fetch your own message."});
  // }
  try {
		const message = await Message.findOne({ _id: req.params.id })
		res.json(message)
	} catch {
		res.status(404)
		res.json({ error: "Message doesn't exist!" })
	}
});

//Get messages
const getMessages = asyncHandler(async (req, res) => {
  // if(req.userRole !== 'admin'){
  //   res.status(403).json({error : 'Unauthorised access. Reserved for admins'});
  // }
  const messages = await Message.find()
  res.status(200).json(messages);
});

//Send message
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
//Update message
const updateMessage = asyncHandler(async (req, res) => {
  // if(req.userRole !== 'admin' && req.userId !== req.params.id){
  //   res.status(401).json({error : "Unauthorised access. You can only update your own message."});
  // }
  const message = await Message.findById(req.params.id)

  if(!message){
    res.status(404).json("Message is not found")   
}

  const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
  })
  res.status(200).json(updatedMessage);
});
//Delete Single message
const deleteMessage = asyncHandler(async (req, res) => {
  // if(req.userRole !== 'admin' && req.userId !== req.params.id){
  //   res.status(403).json({error : "Unauthorised access. You can only delete your own message."});
  // }
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
  if(req.userRole !== 'admin'){
    res.status(403).json({error : 'Unauthorised access. Reserved for admins'});
  }
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


export {
  getMessages,
  getMessage,
  setMessage,
  updateMessage,
  deleteMessage,
  deleteMessages
};
