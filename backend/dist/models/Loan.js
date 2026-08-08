import mongoose, { Schema } from "mongoose";
const LoanSchema = new Schema({
    borrowerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "SANCTIONED", "REJECTED", "DISBURSED", "CLOSED"],
        default: "PENDING",
    },
    amount: {
        type: Number,
        required: true,
        min: 50000,
        max: 500000,
    },
    tenure: {
        type: Number,
        required: true,
        min: 30,
        max: 365,
    },
    salarySlipUrl: {
        type: String,
        required: true,
    },
    rejectionReason: {
        type: String,
    },
    totalRepayment: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
export default mongoose.model("Loan", LoanSchema);
