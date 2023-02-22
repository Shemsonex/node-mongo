import asyncHandler from 'express-async-handler'
import multer from 'multer'
import path from 'path'
import {Blog, validateBlog} from '../models/blogModel.js'
import Comment from '../models/commentsModel.js'
import authenticate from '../middleware/authenticate.js'
import Like from '../models/likesModel.js'
import cloudinary from '../helpers/imageUpload.js'

// export const uploadImage = async (req, res) => {
//   const blog = req;
//   if(!blog){
//     return res
//       .status(401)
//       .json({ success: false, message: 'Error uploading Image!' });
//     }
//     // console.log(blog.file)
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       // public_id: `${blog._id}_profile`,
//       width: 500,
//       height: 500,
//       crop: 'fill'
//     });

//     console.log(result);
//     // updateBlogImage(req, res) ;
// }

const setImage = async (req, res) => {  
  const blog = req;
  if(!blog){
    return res
      .status(401)
      .json({ success: false, message: 'Error uploading Image!' });
    }
    // console.log(blog.file)
    const result = await cloudinary.uploader.upload(req.file.path, {
      // public_id: `${blog._id}_profile`,
      width: 500,
      height: 500,
      crop: 'fill'
    });

    console.log(result);
  try{
    // Saving the image link in the DB
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = (blogsAtStart[blogsAtStart.length - 1].toJSON()._id).valueOf()
    const blogUpdate = { image: result.url };
    const updatedBlog = await Blog.findByIdAndUpdate(blogToUpdate, blogUpdate, {
      new : true,
    })
    if(res.statusCode==200){
       return res.status(200).json({message : 'Image Link saved successfully', updatedBlog}); 
    }else{
      console.log(res.statusCode)
    }  
  }catch (e){
    console.log(e.message)
  }
}

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
  // console.log(req.body);
    if(!req.body.title || !req.body.content ){
          res.status(400)
          //res.send(req.body.title)
          throw new Error("Please add the required blog details") 
    }    

    Blog.findOne({ title: req.body.title }, async (err, data) => {

      //if blog not in db, add it
      if (!data) {
          //create a new BLOG object using the BLOG model and req.body
          // const image = req.file ? '/uploads/' + req.file.filename : null;

          const blog = await new Blog({
              title:req.body.title,
              // image: image, // placeholder for now
              category: req.body.category,
              content: req.body.content,
          })

          // save this object to database
          blog.save((err, data)=>{
              if(err) throw new Error(err);
              return res.status(201).json(data);
          })

          // uploadImage(req, res)
      //if there's an error or the BLOG is in db, return a message         
      }else{
          return res.status(403).json({message:"Blog already exists"});
      }
  })    
});


//Update Blogs
const updateBlog = asyncHandler(async (req, res) => {
  // if(req.userRole !== 'admin' && req.userId !== req.params.id){
  //   res.status(403).json({error : "Unauthorised access. You can only update your own blog."});
  // }
 
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
  })
  res.status(200).json({message : 'Blog updated successfully', updatedBlog});  
});


//Delete single Blog
const deleteBlog = asyncHandler(async (req, res) => {
  // console.log(req.userRole)
  if(req.userRole !== 'admin'){
    res.status(403).json({error : 'Unauthorised access. Reserved for admins'});
  }
  const blog = await Blog.findById(req.params.id)

  if(!blog){
    res.status(204)
    return res.json({message:"Blog not found"});
  }
  await blog.deleteOne()
  res.status(200).json({
    id: req.params.id
  });
});

//Delete All Blogs
const deleteBlogs = asyncHandler(async (req, res) => {
  if(req.userRole !== 'admin'){
    res.status(403).json({error : 'Unauthorised access. Reserved for admins'});
  }
  const blog = await Blog.find()
  if(!blog){
    res.status(404).json({error : 'No blogs are found'})
  }
    blog.forEach(element => {
       element.remove()
    });
 // await user.deleteMany()
  res.status(200).json({
    message : 'All blogs are deleted'
  });
});
          // ##  COMMENTS ###
// --- ADD BLOG COMMENT ---
const setComment = asyncHandler(async (req, res) => {
 
  if(!req.body.text){
    res.status(400) 
    throw new Error("Please add the required comment details") 
}
 
  const comment =  new Comment({
    blog:req.params.id,
    user: req.userId,
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

// --- LIKES FUNCTIONALITY  ---
// --- Like BLOG  ---
const setLike = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const userId = req.userId;
  //console.log(userId);
    const blog = await Blog.findById(blogId);
  try {
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the user has already liked the blog
    if (blog.likes.includes(userId)) {
      return res.status(400).json({ error: 'User has already liked this blog' });
    }
    blog.likes.push(userId);
    await blog.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
})

//Get comments
const getLikes = asyncHandler(async (req, res) => {
  const likes = await Like.find()
  console.log('likes');
  res.status(200).json(likes);
});

export {
  getBlogs,
  getBlog,
  setBlog,
  setImage,
  updateBlog,
  deleteBlog,
  deleteBlogs,
  setComment,
  getComments,
  upload,
  getLikes,
  setLike,
};
