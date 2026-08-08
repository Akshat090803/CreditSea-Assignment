import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
dotenv.config();
const seedAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB. Clearing existing users...');
        // Optional: Clear existing users to prevent duplicate email errors during seeding
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('password123', 10);
        const roles = ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'];
        const usersToCreate = roles.map(role => ({
            name: `${role} User`,
            email: `${role.toLowerCase()}@test.com`,
            passwordHash,
            role
        }));
        await User.insertMany(usersToCreate);
        console.log('Successfully seeded 1 account per role!');
        console.log('Evaluator Credentials:');
        roles.forEach(role => {
            console.log(`Role: ${role} | Email: ${role.toLowerCase()}@test.com | Password: password123`);
        });
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        mongoose.connection.close();
    }
};
seedAccounts();
