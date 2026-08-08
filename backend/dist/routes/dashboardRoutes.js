import { Router } from 'express';
import { getSalesLeads, reviewLoan, disburseLoan, recordPayment, getLoans } from '../controllers/dashboardController.js';
import { verifyTokenAndRole } from '../middlewares/authMiddleware.js';
const router = Router();
// Sales Route
router.get('/sales', verifyTokenAndRole(['Sales']), getSalesLeads);
// Sanction Route
router.put('/sanction/:loanId', verifyTokenAndRole(['Sanction']), reviewLoan);
// Disbursement Route
router.put('/disburse/:loanId', verifyTokenAndRole(['Disbursement']), disburseLoan);
// Collection Route
router.post('/collection/:loanId', verifyTokenAndRole(['Collection']), recordPayment);
router.get('/loans', verifyTokenAndRole(['Admin', 'Sanction', 'Disbursement', 'Collection']), getLoans);
export default router;
