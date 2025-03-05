import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    // fields for teacher
    sslczStoreId: "",
    sslczStorePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSslczPassword, setShowSslczPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Firstname and Lastname validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (formData.role === 'teacher') {
      if (!formData.sslczStoreId.trim()) {
        newErrors.sslczStoreId = "SSLCommerz Store ID is required for teachers";
      }
      if (!formData.sslczStorePassword.trim()) {
        newErrors.sslczStorePassword = "SSLCommerz Store Password is required for teachers";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset SSLCommerz fields when role changes
    if (name === 'role') {
      if (value !== 'teacher') {
        setFormData(prev => ({
          ...prev,
          sslczStoreId: '',
          sslczStorePassword: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      
      // Only include SSLCommerz fields if role is teacher
      const finalSubmitData = formData.role === 'teacher' 
        ? { 
            ...submitData, 
            sslczStoreId: formData.sslczStoreId,
            sslczStorePassword: formData.sslczStorePassword 
          }
        : submitData;
      

      const response = await axios.post('/api/v1/register', finalSubmitData);
      
      if (response.status === 201) {
        // Show success message or toast notification
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in.' 
          } 
        });
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        const errorMessage = error.response.data.message || 
          "Registration failed. Please try again.";
        setErrors(prev => ({ ...prev, submit: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, submit: "Network error. Please check your connection." }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    switch(field) {
      case 'password':
        setShowPassword(!showPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      case 'sslczPassword':
        setShowSslczPassword(!showSslczPassword);
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${errors.firstname 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
              )}
            </div>
            <div className="w-1/2">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter last name"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${errors.lastname 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                ${errors.username 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                ${errors.email 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Fields with Show/Hide */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`mt-1 block w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`mt-1 block w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="flex justify-center space-x-6">
              {['student', 'teacher'].map(role => (
                <label 
                  key={role} 
                  className={`flex items-center px-4 py-2 border rounded-md cursor-pointer transition-colors 
                    ${formData.role === role 
                      ? 'bg-indigo-500 text-white border-indigo-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs text-center mt-2">{errors.role}</p>
            )}
          </div>
          {/* Conditional SSLCommerz Fields for Teachers */}
          {formData.role === 'teacher' && (
            <>
              <div className="mt-4">
                <label htmlFor="sslczStoreId" className="block text-sm font-medium text-gray-700">
                  SSLCommerz Store ID
                </label>
                <input
                  type="text"
                  id="sslczStoreId"
                  name="sslczStoreId"
                  value={formData.sslczStoreId}
                  onChange={handleChange}
                  placeholder="Enter SSLCommerz Store ID"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                    ${errors.sslczStoreId 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                />
                {errors.sslczStoreId && (
                  <p className="text-red-500 text-xs mt-1">{errors.sslczStoreId}</p>
                )}
              </div>
  
              <div className="mt-4 relative">
                <label htmlFor="sslczStorePassword" className="block text-sm font-medium text-gray-700">
                  SSLCommerz Store Password
                </label>
                <div className="relative">
                  <input
                    type={showSslczPassword ? "text" : "password"}
                    id="sslczStorePassword"
                    name="sslczStorePassword"
                    value={formData.sslczStorePassword}
                    onChange={handleChange}
                    placeholder="Enter SSLCommerz Store Password"
                    className={`mt-1 block w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                      ${errors.sslczStorePassword 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('sslczPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showSslczPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.sslczStorePassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.sslczStorePassword}</p>
                )}
              </div>
            </>
          )}

          {/* Global Error Message */}
          {errors.submit && (
            <div className="text-center text-red-500 text-sm mb-4">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {isLoading ? 'Signing Up...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}