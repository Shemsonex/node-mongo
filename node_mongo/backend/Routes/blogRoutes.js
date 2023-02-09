const express = require("express");
const {authenticate, authenticateUser }= require('../middleware/authenticate')

const router = express.Router();
const {
  getBlogs,
  getBlog,
  setBlog,
  updateBlog,
  deleteBlog,
  deleteBlogs,
  setComment,
  upload,
  getComments,
} = require("../controllers/blogController");

router.route("/").get(getBlogs).post(upload.single('image'), setBlog).delete(deleteBlogs);
router.route("/:id").put(updateBlog).delete(deleteBlog).get(getBlog);
router.route("/:id/comments").get(authenticate,getComments).post(authenticate, setComment)

module.exports = router;
