import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteAccount, viewProfile, updateProfile, getUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/viewprofile").get(verifyJWT, viewProfile);
router.route("/deleteaccount").delete(verifyJWT, deleteAccount);
router.route("/updateprofile").put(
  verifyJWT, 
  upload.single('coverImage'), 
  updateProfile
);
router.route("/get-user/:id").get(verifyJWT, getUser);


export default router;