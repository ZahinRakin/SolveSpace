import crypto from 'crypto';
import bcrypt from 'bcrypt';

import User from "../models/users.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { transporter } from "../constants.js";



const forgetPassword = asyncHandler(async (req, res) => {

  const { email } = req.body.trim();
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await User.findOne({ email });
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000;
  
  if (user) {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
  }

  res.json({ 
    message: 'If an account exists with this email, you will receive password reset instructions.' 
  });
});

const veryfyResetToken = asyncHandler( async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  res.json({ message: 'Token is valid' });
});

const resetPassword = asyncHandler( async (req, res) => {

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset Successful',
    html: `
      <p>Your password has been successfully reset.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `
  });

  res.json({ message: 'Password reset successful' });
});

export { forgetPassword, veryfyResetToken, resetPassword };