import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        token: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { token, newPassword, confirmNewPassword } = formData;

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            console.log("control reached here"); //test ofc
            await axios.post('/api/v1/reset-password', { token, newPassword });
            alert("Password reset successful!");
            navigate('/login');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Failed to reset password. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
                            type={showPassword ? "text" : "password"}
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
                            type={showPassword ? "text" : "password"}
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={toggleShowPassword}
                            className="mr-2"
                        />
                        <label htmlFor="showPassword" className="text-sm">Show Passwords</label>
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
