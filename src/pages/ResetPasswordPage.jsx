import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        token: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { token, newPassword, confirmNewPassword } = formData;

        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match");
            return;
        }

        axios.post('/api/v1/reset-password', { token, newPassword })
            .then(_ => {
                alert("Password reset successful!");
                navigate('/login');
            })
            .catch(error => {
                console.error(error);
                alert("Failed to reset password. Please try again later.");
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="token" className="block text-sm font-medium mb-1">
                            Token
                        </label>
                        <input
                            type="text"
                            id="token"
                            name="token"
                            value={formData.token}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
