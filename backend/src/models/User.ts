import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Sales' | 'Sanction' | 'Disbursement' | 'Collection' | 'Borrower';
  personalDetails?: {
    pan: string;
    dob: Date;
    monthlySalary: number;
    employmentMode: 'Salaried' | 'Self-Employed' | 'Unemployed';
  };
}

const UserSchema = new Schema<IUser>({
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

export default mongoose.model<IUser>('User', UserSchema);