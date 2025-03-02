import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      console.error("No access token found. Redirecting to login...");
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-xl font-bold ml-4 text-gray-800">View Profile</h1>
      </header>

      {/* Loading & Error Handling */}
      <div className="flex items-center justify-center mt-8">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            {/* Cover Image */}
            {profileData.coverImage && (
              <img
                src={profileData.coverImage}
                alt="Cover"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            {/* Profile Information */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {profileData.firstname} {profileData.lastname}</p>
              <p><strong>Username:</strong> {profileData.username}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Role:</strong> {profileData.role}</p>
            </div>

            <button
              onClick={() => navigate("/editprofile")}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewProfilePage;
