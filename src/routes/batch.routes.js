import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { createBatch } from "../controllers/teacher.controllers.js";
import { leaveBatch } from "../controllers/student.controllers.js";
import {
  addUserToBatch,
  removeUserFromBatch,
  destroyBatch
} from "../controllers/batch.controllers.js";

const router = Router();
//both
router.route("/add-user/:batch_id/:user_id").post(verifyJWT, addUserToBatch);
router.route("/remove-user/:batch_id/:user_id").delete(verifyJWT, removeUserFromBatch);
router.route("/destroy/:id").delete(verifyJWT, destroyBatch);
//student
router.route("/student/leave/:id").delete(verifyJWT, leaveBatch);
//teacher
router.route("/teacher/create-batch/:id").post(verifyJWT, createBatch);

export default router;