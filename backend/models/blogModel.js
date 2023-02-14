import mongoose from "mongoose"

const blogSchema = mongoose.Schema({
  title: {
    type: "string",
    required: [true, "Please add a blog title"],
  },
  category: {
    type: 'string',
  },
  image: {
    type: String,
  },
  content: {
    type: "string",
    required: [true, "Please add a blog content"],
  },
  likes: {
    type: Array,
  },
},{
    timestamps : true,
});
const validateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(5).max(10000).required(),
    category: Joi.string().min(5).max(100), 
    image: Joi.string(),
  });

  return schema.validate(blog);
};

const Blog = mongoose.model("Blog", blogSchema)

export {Blog, validateBlog}