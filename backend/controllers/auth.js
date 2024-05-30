import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

/* REGISTER USER */

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 1 hour
        );

        res.status(200).json({ access_token: token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(403).json({ message: 'Access Denied, No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { id: verified.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // New token expires in 1 hour
        );

        res.status(200).json({ access_token: newAccessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  
      await user.save();
  
      // Send email with resetToken (using a mail service like SendGrid, NodeMailer, etc.)
  
      res.status(200).json({ message: 'Password reset link sent', resetToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


