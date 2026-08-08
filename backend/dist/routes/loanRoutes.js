import { Router } from 'express';
import { verifyTokenAndRole } from '../middlewares/authMiddleware.js';
import { applyForLoan } from '../controllers/loanController.js';
const router = Router();
// Only Borrowers can apply for a loan
router.post('/apply', verifyTokenAndRole(['Borrower']), applyForLoan);
export default router;
