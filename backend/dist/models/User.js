import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'],
        default: 'Borrower'
    },
    personalDetails: {
        pan: String,
        dob: Date,
        monthlySalary: Number,
        employmentMode: { type: String, enum: ['Salaried', 'Self-Employed', 'Unemployed'] }
    }
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
