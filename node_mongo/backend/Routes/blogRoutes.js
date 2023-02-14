import express from "express";
import {authenticate, authenticateUser } from '../middleware/authenticate.js'

const router = express.Router();
import {
  getBlogs,
  getBlog,
  setBlog,
  setImage,
  updateBlog,
  deleteBlog,
  deleteBlogs,
  setComment,
  upload,
  getComments,
  getLikes,
  setLike,
} from "../controllers/blogController.js";

router.route("/").get(getBlogs).post(setBlog).delete(deleteBlogs);
router.route("/:id").put(authenticate, updateBlog).delete(authenticate, deleteBlog).get(getBlog);
router.route("/:id/blogPicture").put(upload.single('image'), setImage);
router.route("/:id/comments").get(authenticate,getComments).post(authenticate, setComment)
router.route("/:id/likes").get(authenticate,getLikes).post(authenticate, setLike)

export default router;
