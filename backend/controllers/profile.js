import User from '../models/User.js';

// VIEW PROFILE
export const viewProfile = async (req, res) => {
    try {
        const id = req.params.id
        console.log('this is id',id)
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Basic validation (you can expand this as needed)
        if (updates.email && !/^\S+@\S+\.\S+$/.test(updates.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PROFILE
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
