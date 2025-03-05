import { Router } from 'express';
import { createReport, updateReport, deleteReport, getYourReports } from '../controllers/report.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/create').post(verifyJWT, createReport);
router.route('/update/:id').put(verifyJWT, updateReport);
router.route('/delete/:id').delete(verifyJWT, deleteReport);
router.route('/get-reports').get(verifyJWT, getYourReports);


export default router;

