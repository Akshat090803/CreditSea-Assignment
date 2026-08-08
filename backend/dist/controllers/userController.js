import User from '../models/User.js';
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { dob, monthlySalary, employmentMode, pan } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.personalDetails = {
            dob: new Date(dob),
            monthlySalary: Number(monthlySalary),
            employmentMode,
            pan
        };
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
