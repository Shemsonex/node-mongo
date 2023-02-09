const asyncHandler = require('express-async-handler')
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel')
const Comment = require('../models/commentsModel')
const cloudinary = require('cloudinary').v2;
const authenticate = require('../middleware/authenticate')

 
// Configuration 
cloudinary.config({
  cloud_name: "dir6akgf8",
  api_key: "558841897122288",
  api_secret: "DxV73zCbjvJl2kcgEbCLNMqTFKQ"
});

//CREATE STORAGE FOR IMAGE
 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, './uploads');
     },
   filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
 });

const upload = multer({storage: storage})
// Get Single Blog
const getBlog = asyncHandler(async (req, res) => {
  try {
		const blog = await Blog.findOne({ _id: req.params.id })
   // res.contentType('image/jpeg').send(blog.image);
		res.send({
      title:blog.title,
      image: blog.image, // placeholder for now
      category: blog.category,
      content: blog.content,
    })
	} catch {
		res.status(404)
		res.json({ error: "Blog doesn't exist!" })
	}
});

//Get blogs
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
  res.status(200).json(blogs);
});

//Set Blog
const setBlog = asyncHandler(async (req, res) => {
  //console.log(req.body);
    if(!req.body.title || !req.body.content ){
          res.status(400)
          //res.send(req.body.title)
          throw new Error("Please add the required blog details") 
    }
   
    Blog.findOne({ title: req.body.title }, async (err, data) => {

      //if blog not in db, add it
      if (!data) {
          //create a new POST object using the POST model and req.body
          const blog = await new Blog({
              title:req.body.title,
              image: '/uploads/' + req.file.filename, // placeholder for now
              category: req.body.category,
              content: req.body.content,
          })

          // save this object to database
          blog.save((err, data)=>{
              if(err) return res.json({Error: err});
              return res.status(201).json(data);
          })
      //if there's an error or the POST is in db, return a message         
      }else{
          if(err) return res.json({message:"Blog already exists"});
      }
  })    
});
//Update Blogs
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if(!blog){
    res.status(404)
    return res.json({message:"Blog already exists"});
    }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
  })
  res.status(200).json(updatedBlog);
});
//Delete single Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if(!blog){
    res.status(400)
    return res.json({message:"Blog not found"});
  }
  await blog.remove()
  res.status(200).json({
    id: req.params.id
  });
});

//Delete All Blogs
const deleteBlogs = asyncHandler(async (req, res) => {
  const blog = await Blog.find()
  if(!blog){
    res.status(404).json({error : 'No blogs are found'})
  }
    blog.forEach(element => {
       element.remove()
    });
 // await user.deleteMany()
  res.status(200).json({
    blog,
  });
});
          // ##  COMMENTS ###
// --- ADD POST COMMENT ---
const setComment = asyncHandler(async (req, res) => {
 
  if(!req.body.text){
    res.status(400) 
    throw new Error("Please add the required comment details") 
}
 
  const comment = await new Comment({
    blog:req.params.id,
    user: req.user,
    text: req.body.text,
  })

   // save this comment to database
          comment.save((err, data)=>{
              if(err) return res.json({Error: err});
              return res.status(201).json(data);
          })
})

//Get comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
  res.status(200).json(comments);
});


module.exports = {
  getBlogs,
  getBlog,
  setBlog,
  updateBlog,
  deleteBlog,
  deleteBlogs,
  setComment,
  getComments,
  upload,
};
