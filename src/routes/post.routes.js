import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createPost,
  updatePost,
  deletePost
} from "../controllers/post.controllers.js";
import { 
  showInterest,
  cancelInterest,
  searchStudent,
} from "../controllers/teacher.controllers.js";

import {
  applyToJoin,
  cancelJoin,
  acceptTeacher,
  searchTeacher
} from "../controllers/student.controllers.js";

const router = Router();
//both
router.route("/create").post(verifyJWT, createPost); //tested
router.route("/update/:id").put(verifyJWT, updatePost); //tested
router.route("/delete/:id").delete(verifyJWT, deletePost); //tested
//teacher
router.route("/teacher/apply/:id").post(verifyJWT, showInterest); //tested
router.route("/teacher/retract/:id").delete(verifyJWT, cancelInterest); //tested
router.route("/teacher/search").get(verifyJWT, searchStudent); //tested
//student
router.route("/student/apply/:id").post(verifyJWT, applyToJoin); //tested
router.route("/student/retract/:id").delete(verifyJWT, cancelJoin); //tested
router.route("/student/accept/:post_id/:teacher_id").post(verifyJWT, acceptTeacher); //tested
router.route("/student/search").get(verifyJWT, searchTeacher); //tested

export default router;