import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { createBatch } from "../controllers/teacher.controllers.js";
import { leaveBatch } from "../controllers/student.controllers.js";
import {
  addUserToBatch,
  removeUserFromBatch,
  destroyBatch,
  updateBatch,
  getYourBatches,
  askForPayment
} from "../controllers/batch.controllers.js";

const router = Router();
//both
router.route("/add-user/:batch_id/:user_id").post(verifyJWT, addUserToBatch); //tested (teacher)
router.route("/remove-user/:batch_id/:user_id").delete(verifyJWT, removeUserFromBatch); //tested (teacher)
router.route("/destroy/:id").delete(verifyJWT, destroyBatch); //tested (teacher)
router.route("/update/:id").put(verifyJWT, updateBatch); //tested (student)
router.route("/batches").get(verifyJWT, getYourBatches);
//student
router.route("/student/leave/:id").delete(verifyJWT, leaveBatch); //tested (student(only one))
//teacher
router.route("/teacher/create-batch/:post_id").post(verifyJWT, createBatch); //tested (teacher (post with 0 students))
router.route("/teacher/ask-for-paryment/:id").post(verifyJWT, askForPayment); 

export default router;