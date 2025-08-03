import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import LoginForm from "../component/LoginForm.jsx";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/v1/login", formData);
      
      // Try to get token from response body first (more reliable), then from headers as fallback
      let accessToken;
      let role;
      
      if (response.data.data && response.data.data.accessToken) {
        accessToken = response.data.data.accessToken;
        role = response.data.data.role;
      } else if (response.headers["authorization"]) {
        accessToken = response.headers["authorization"].replace("Bearer ", "");
        const decoded = jwt_decode(accessToken);
        role = decoded.role;
      } else {
        // If neither works, log for debugging
        console.log("Full response:", response);
        console.log("Response headers:", response.headers);
        console.log("Response data:", response.data);
        throw new Error("No access token found in response");
      }
      
      localStorage.setItem("accessToken", accessToken);

      const dashboardRoutes = {
        student: "/student/dashboard",
        teacher: "/teacher/dashboard",
        admin: "/admin/dashboard",
      };

      console.log("Navigating to:", dashboardRoutes[role]); //test ofc

      navigate(dashboardRoutes[role] || "/");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">SolveSpace Login</h1>
        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;