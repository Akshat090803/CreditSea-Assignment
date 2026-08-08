import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import Loan from '../models/Loan.js';
import User from '../models/User.js';
import { runBusinessRuleEngine, calculateRepayment } from '../utils/breService.js';

export const applyForLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { amount, tenure, salarySlipUrl } = req.body;

    
    if (amount < 50000 || amount > 500000) {
      res.status(400).json({ error: "Loan amount must be between 50K and 5L." });
      return;
    }
    
    if (tenure < 30 || tenure > 365) {
      res.status(400).json({ error: "Tenure must be between 30 and 365 days." });
      return;
    }

    const user = await User.findById(userId);
    
    // Ensure the user has completed Step 2 (Personal Details)
    if (!user || !user.personalDetails) {
      res.status(400).json({ error: "User personal details missing. Please complete your profile first." });
      return;
    }

    // Run the Business Rule Engine (BRE) 
    const breResult = runBusinessRuleEngine({
      dob: user.personalDetails.dob,
      monthlySalary: user.personalDetails.monthlySalary,
      employmentMode: user.personalDetails.employmentMode,
      pan: user.personalDetails.pan
    });

    // If any rule fails, block the application
    if (!breResult.passed) {
      res.status(400).json({ error: breResult.error });
      return;
    }

    // Calculate Total Repayment = P + SI
    const totalRepayment = calculateRepayment(amount, tenure);

   
    const newLoan = new Loan({
      borrowerId: userId,
      amount,
      tenure,
      salarySlipUrl,
      totalRepayment,
      status: 'PENDING'
    });

    await newLoan.save();
    res.status(201).json({ message: "Loan application submitted successfully", loan: newLoan });
    
  } catch (error) {
    console.error("Error applying for loan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};