import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  teacherDashboard,

  postTuition,
  updatePost,
  deletePost,
  createBatch,

  showInterest,
  cancelInterest,

  searchStudent,
  removeStudentFromBatch,
  addStudentToBatch,
} from "../controllers/teacher.controllers.js";

const router = Router();

router.route("/dashboard").get(verifyJWT, teacherDashboard);

router.route("/post-tuition").post(verifyJWT, postTuition);
router.route("/update-post/:id").put(verifyJWT, updatePost);
router.route("/delete-post/:id").delete(verifyJWT, deletePost);
router.route("/create-batch/:id").post(verifyJWT, createBatch);

router.route("/show-interest/:id").post(verifyJWT, showInterest);
router.route("/cancel-interest/:id").delete(verifyJWT, cancelInterest);

router.route("/search-student").get(verifyJWT, searchStudent);
router.route("/remove-student/:id").delete(verifyJWT, removeStudentFromBatch);
router.route("/add-student/:id").put(verifyJWT, addStudentToBatch);

export default router;