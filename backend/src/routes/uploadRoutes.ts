import { Router } from 'express';

import { verifyTokenAndRole } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import { uploadSalarySlip } from '../controllers/uploadController.js';

const router = Router();


router.post('/', verifyTokenAndRole(['Borrower']), upload.single('file'), uploadSalarySlip);

export default router;