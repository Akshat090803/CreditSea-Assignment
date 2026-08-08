import { Router } from 'express';
import { updateProfile } from '../controllers/userController.js';
import { verifyTokenAndRole } from '../middlewares/authMiddleware.js';
const router = Router();
router.put('/profile', verifyTokenAndRole(['Borrower']), updateProfile);
export default router;
