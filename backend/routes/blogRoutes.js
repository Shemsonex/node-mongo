/**
 * @swagger
 * components:
 *   schemas:
 *     create:
 *       type: object
 *       required:
 *         - title
 *         - blogImage
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of blog
 *         imageUrl:
 *           type: string
 *           description: The url of uploaded image
 *         content:
 *           type: string
 *           description: The blog's content
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         imageUrl: http://res.cloudinary.com/duneotoap/image/upload/v1676387163/p8j9h7gwdpdwhzfg7cdi.jpg
 *         content: Turing has recently introduced to the public a new common transportation omnibus
 *     getblogs:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          code: 200
 *          message: Blogs found
 *          Blogs: {}
 *     getblog:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          {
 *            "title": "VS Code",
 *             "image": "http://res.cloudinary.com/duneotoap/image/upload/v1676387163/p8j9h7gwdpdwhzfg7cdi.jpg",
 *              "content": "VS Code is a very powerful tool used by many developers due to its cool features and simplicity"
 *          }
 *     blognotfound:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          error: Blog doesn't exist
 */
/**
 * @swagger
 * tags:
 *    name: Blogs
 *    description: Blog API
 * /api/blogs:
 *   get:
 *      summary: Gets all blogs
 *      tags: [Blogs]
 *      responses:
 *        200:
 *          description: Blogs Fetched
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/getblogs'
 * /api/blogs/{id}:
 *   get:
 *      summary: Gets a blog by Id
 *      parameters :
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description : object id of blog
 *      tags: [Blogs]
 *      responses:
 *        200:
 *          description: Blog Found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/getblog'
 *        404:
 *          description: Blog not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/blognotfound'
 */
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
