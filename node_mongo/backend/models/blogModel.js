const mongoose = require("mongoose");

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
},{
    timestamps : true,
});

module.exports = mongoose.model("Blog", blogSchema)