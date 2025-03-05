import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  adminDashboard,
  addUser,
  removeUser,
  viewAllStudent,
  viewAllTeacher,
  viewAllPosts,
  removePost,
  addPost,
  viewAllBatches,
  removeBatch,
  addBatch
} from "../controllers/admin.controllers.js";

import { validateRegistration } from "../middlewares/validate.middlewares.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, adminDashboard);
router.route("/add-user").post(verifyJWT, validateRegistration, addUser);
router.route("/remove-user/:id").delete(verifyJWT, removeUser);
router.route("/students").get(verifyJWT, viewAllStudent);
router.route("/teachers").get(verifyJWT, viewAllTeacher);
//posts
router.route("/posts").get(verifyJWT, viewAllPosts);
router.route("/remove-post/:post_id").delete(verifyJWT, removePost);
router.route("/add-post").post(verifyJWT, addPost);
//batches
router.route("/batches").get(verifyJWT, viewAllBatches);
router.route("/remove-post/:post_id").delete(verifyJWT, removeBatch);
router.route("/add-post").post(verifyJWT, addBatch);


export default router;