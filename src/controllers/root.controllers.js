import crypto from 'crypto';

import User from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { transporter } from "../constants.js";

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to SMTP server:", error);
  } else {
    console.log("SMTP server is ready to take messages:", success);
  }
}); //this checks whether the email is connected or not.

const forgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000;
  
  if (user) {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
        
    await transporter.sendMail({ //this one isn't working
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Copy and paste this link in the to reset your password:</p>
        <div>${resetToken}</div>
        <p>This link will expire in 1 hour.</p>
      `
    });
  }

  res.json({ 
    message: 'If an account exists with this email, you will receive password reset instructions.' 
  });
});


const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await verifyResetToken(token);
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Successful',
      html: `
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function verifyResetToken(token) {
  if (!token) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid token!"
    });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError({
      statusCode: 400,
      message: 'Invalid or expired reset token'
    });
  }

  return user;
};


export { forgetPassword, resetPassword };