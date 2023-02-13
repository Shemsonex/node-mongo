import express from "express"
const router = express.Router();
import multer from 'multer'
import { authenticate, authenticateUser } from '../middleware/authenticate.js'
import {
  getUsers,
  getUser,
  setUser,
  updateUser,
  deleteUser,
  deleteUsers,
} from "../controllers/userController.js"

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").get(authenticate, getUsers).post(setUser).delete(authenticate, deleteUsers);
router.route("/:id").put(authenticate, updateUser).delete(authenticate, deleteUser).get(authenticate, getUser);
router.route("/authenticate").post(authenticateUser)
//router.route("/:id/upload-profile-picture").post(upload.single('picture'),setProfilePicture);

export default router;
