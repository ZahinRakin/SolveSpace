import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, User, Mail, AtSign, AlertCircle, CheckCircle } from "lucide-react";

function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    coverImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async (accessToken) => {
      try {
        const response = await axios.get("/api/v1/users/viewprofile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { firstname, lastname, username, email } = response.data.data;
        setFormData({ firstname, lastname, username, email, coverImage: null });
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          await handleRefreshToken();
        } else {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile.");
          setLoading(false);
        }
      }
    };

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(accessToken);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Refresh access token
  const handleRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newAccessToken = response.data.newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      const fetchProfile = async (token) => {
        try {
          const response = await axios.get("/api/v1/users/viewprofile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { firstname, lastname, username, email } = response.data.data;
          setFormData({ firstname, lastname, username, email, coverImage: null });
          setLoading(false);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Failed to load profile.");
          setLoading(false);
        }
      };
      await fetchProfile(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate("/login");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const accessToken = localStorage.getItem("accessToken");
    const formDataObj = new FormData();
    formDataObj.append("firstname", formData.firstname);
    formDataObj.append("lastname", formData.lastname);
    formDataObj.append("username", formData.username);
    formDataObj.append("email", formData.email);
    if (formData.coverImage) {
      formDataObj.append("coverImage", formData.coverImage);
    }

    try {
      await axios.put("/api/v1/users/updateprofile", formDataObj, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold ml-4 text-gray-800">Edit Profile</h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow-sm rounded-lg p-6">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Cover Image Preview */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              ) : null}
              <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                <Camera size={20} className="text-gray-700" />
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                  <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {message && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5" />
                  <p className="text-green-700">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="John"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfilePage;