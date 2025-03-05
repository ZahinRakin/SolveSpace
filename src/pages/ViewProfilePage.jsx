import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, User, Edit, ArrowLeft } from "lucide-react";

function ViewProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile data
  const fetchProfile = async (accessToken) => {
    try {
      const response = await axios.get("/api/v1/users/viewprofile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfileData(response.data.data);
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

  // Refresh access token
  const handleRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newAccessToken = response.data.newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      await fetchProfile(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate('/login');
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(accessToken);
    } else {
      navigate('/login');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Loading Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Return to Login
          </button>
        </div>
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
            <h1 className="text-2xl font-bold text-white">Profile Details</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-8 p-8">
          {/* Left Column - Profile Image */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt={`${profileData.firstname} ${profileData.lastname}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="text-gray-500" size={64} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.firstname} {profileData.lastname}
            </h2>
            <p className="text-gray-500 mb-4">@{profileData.username}</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {profileData.role}
            </span>
          </div>

          {/* Right Column - Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="mr-4 text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{profileData.firstname} {profileData.lastname}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-4 text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-4 text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium">{profileData.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {profileData.bio && (
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  About Me
                </h3>
                <p className="text-gray-600">{profileData.bio}</p>
              </div>
            )}

            <div>
              <button
                onClick={() => navigate("/editprofile")}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <Edit className="mr-2" size={20} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfilePage;

