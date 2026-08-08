import { Request, Response } from 'express';
import User from '../models/User.js';
import Loan from '../models/Loan.js';
import Payment from '../models/Payment.js';

// sales
// Handles  users who registered but haven't applied
export const getSalesLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    //finad all applicants
    const loans = await Loan.find({}, 'borrowerId'); //[ { borrowerId: "U101" } ]
    const applicantsWithLoans = loans.map(loan => loan.borrowerId); // ["U101"]

    // users with role 'Borrower' who are NOT in the applicants list
    const leads = await User.find({
      role: 'Borrower',
      _id: { $nin: applicantsWithLoans }
    }).select('-passwordHash');

    res.status(200).json({ leads });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

//sanction
// Handles applied loans. Approves or rejects with a reason
export const reviewLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const { status, rejectionReason } = req.body; // status should be 'SANCTIONED' or 'REJECTED'

    if (!['SANCTIONED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status update' });
      return;
    }

    if (status === 'REJECTED' && !rejectionReason) {
      res.status(400).json({ error: 'Rejection reason is required' });
      return;
    }

    const loan = await Loan.findById(loanId);
    if (!loan || loan.status !== 'PENDING') {
      res.status(404).json({ error: 'Pending loan not found' });
      return;
    }

    loan.status = status;
    if (status === 'REJECTED') {
      loan.rejectionReason = rejectionReason;
    }

    await loan.save();
    res.status(200).json({ message: `Loan ${status.toLowerCase()} successfully`, loan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// disbursement
// Handles approved loans. Marks as disbursed
export const disburseLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId);
    if (!loan || loan.status !== 'SANCTIONED') {
      res.status(400).json({ error: 'Loan must be sanctioned before disbursement' });
      return;
    }

    loan.status = 'DISBURSED';
    await loan.save();

    res.status(200).json({ message: 'Loan disbursed successfully', loan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// collection
// Handles active loans. Records payments and auto-closes if fully paid
export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const { utrNumber, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan || loan.status !== 'DISBURSED') {
      res.status(400).json({ error: 'Loan is not active/disbursed' });
      return;
    }

    // Check if UTR is unique
    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      res.status(400).json({ error: 'UTR number must be unique' });
      return;
    }

    // Create payment record
    const payment = new Payment({
      loanId,
      utrNumber,
      amount
    });
    await payment.save();

    // Calculate total paid 
    const allPayments = await Payment.find({ loanId });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Auto-close loan if total amount paid equals total repayment
    if (totalPaid >= loan.totalRepayment) {
      loan.status = 'CLOSED';
      await loan.save();
      res.status(200).json({ message: 'Payment recorded. Loan fully repaid and CLOSED.', payment, loan });
      return;
    }

    res.status(201).json({ 
      message: 'Payment recorded successfully', 
      payment, 
      outstandingBalance: loan.totalRepayment - totalPaid 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLoans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    let query = Loan.find();

    if (typeof status === "string") {
      query = query.where("status").equals(status);
    }

    const loans = await query.populate(
      "borrowerId",
      "name email personalDetails.pan"
    );

    res.status(200).json({ loans });
  } catch (error) {
    console.error("Get Loans Error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};