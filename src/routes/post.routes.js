import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  postTuition,
  updatePost,
  deletePost,
  showInterest,
  cancelInterest,
} from "../controllers/teacher.controllers.js";

import {
  postRequest,
  deleteRequest,
  updateRequest,
  applyToJoin,
  cancelJoin,
} from "../controllers/student.controllers.js";

const router = Router();
//teacher
router.route("/tuition").post(verifyJWT, postTuition);
router.route("/update-tuition/:id").put(verifyJWT, updatePost);
router.route("/delete-tuition/:id").delete(verifyJWT, deletePost);
router.route("/show-interest/:id").post(verifyJWT, showInterest);
router.route("/cancel-interest/:id").delete(verifyJWT, cancelInterest);
//student
router.route("/request").post(verifyJWT, postRequest);
router.route("/update-request/:id").put(verifyJWT, updateRequest);
router.route("/delete-request/:id").delete(verifyJWT, deleteRequest);
router.route("/apply/:id").post(verifyJWT, applyToJoin);
router.route("/cancel-join/:id").delete(verifyJWT, cancelJoin);

export default router;