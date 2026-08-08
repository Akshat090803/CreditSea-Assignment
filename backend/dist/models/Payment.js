import mongoose, { Schema } from 'mongoose';
const PaymentSchema = new Schema({
    loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    utrNumber: { type: String, required: true, unique: true }, // Must be unique across all payments
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model('Payment', PaymentSchema);
