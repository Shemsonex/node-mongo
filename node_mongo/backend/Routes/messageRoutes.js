const express = require("express");
const router = express.Router();
const {authenticate, authenticateUser }= require('../middleware/authenticate')
const {
  getMessages,
  getMessage,
  setMessage,
  updateMessage,
  deleteMessage,
  deleteMessages,
} = require("../controllers/messageController");

router.route("/").get(authenticate, getMessages).post(setMessage).delete(authenticate,deleteMessages);
router.route("/:id").put(authenticate, updateMessage).delete(authenticate, deleteMessage).get(authenticate, getMessage);

module.exports = router;
