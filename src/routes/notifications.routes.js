import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
  getNotifications, 
  deleteNotification 
} from "../controllers/notification.controllers.js";

const router = Router();

router.route("/getnotifications").get(verifyJWT, getNotifications);
router.route("/delete-notification").delete(verifyJWT, deleteNotification);

export default router;