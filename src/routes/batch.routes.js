import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  createBatch,
  removeStudentFromBatch,
  addStudentToBatch,
} from "../controllers/teacher.controllers.js";

import { 
  leaveBatch,
  acceptTeacher,
  destroyBatch
} from "../controllers/student.controllers.js";

const router = Router();
//student
router.route("/accept-teacher/:id").post(verifyJWT, acceptTeacher);
router.route("/leave-batch/:id").delete(verifyJWT, leaveBatch);
router.route("/destroy-batch/:id").delete(verifyJWT, destroyBatch);
//teacher
router.route("/create-batch/:id").post(verifyJWT, createBatch);
router.route("/remove-student/:id").delete(verifyJWT, removeStudentFromBatch);
router.route("/add-student/:id").put(verifyJWT, addStudentToBatch);

export default router;