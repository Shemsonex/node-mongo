import express from "express"
const router = express.Router();
import {authenticate, authenticateUser }from '../middleware/authenticate.js'
import {
  getMessages,
  getMessage,
  setMessage,
  updateMessage,
  deleteMessage,
  deleteMessages,
} from "../controllers/messageController.js"

router.route("/").get(authenticate, getMessages).post(setMessage).delete(authenticate,deleteMessages);
router.route("/:id").put(authenticate, updateMessage).delete(authenticate, deleteMessage).get(authenticate, getMessage);

export default router
