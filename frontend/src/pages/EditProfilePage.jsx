import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, User, Mail, AtSign, AlertCircle, CheckCircle, Edit } from "lucide-react";

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

  //fetch user data
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
      const response = await axios.post("/api/v1/refresh-accesstoken", {}, {
        withCredentials: true,
      });
      const newAccessToken = response.data.data.accessToken;
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

 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20 p-2 rounded-full transition duration-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-8 p-8">
          {/* Left Column - Profile Image Upload */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="text-gray-500" size={64} />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-blue-600 transition duration-300">
                <Camera size={20} />
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, coverImage: file }));
                      
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {formData.firstname} {formData.lastname}
            </h2>
            <p className="text-gray-500 mb-4">@{formData.username}</p>
          </div>

          {/* Right Column - Edit Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
                <AlertCircle className="mr-3 text-red-500" size={24} />
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center">
                <CheckCircle className="mr-3 text-green-500" size={24} />
                <p className="text-green-700">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <Edit className="mr-2" size={20} />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
