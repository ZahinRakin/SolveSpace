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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <div className="w-24"></div> {/* Empty div for balance */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <svg className="h-10 w-10 text-red-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Cover Image */}
            <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden shadow-md bg-gray-300">
              {profileData.coverImage ? (
                <img
                  src={profileData.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              )}
              
              {/* Profile Avatar */}
              <div className="absolute -bottom-16 left-6 h-32 w-32 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={`${profileData.firstname} ${profileData.lastname}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <svg className="h-16 w-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information Card */}
            <div className="mt-16 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profileData.firstname} {profileData.lastname}
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {profileData.role}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">@{profileData.username}</p>
              </div>

              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="text-sm font-medium text-gray-900 col-span-2">
                      {profileData.firstname} {profileData.lastname}
                    </dd>
                  </div>
                  <div className="bg-white px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="text-sm font-medium text-gray-900 col-span-2">
                      {profileData.username}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="text-sm font-medium text-gray-900 col-span-2">
                      {profileData.email}
                    </dd>
                  </div>
                  <div className="bg-white px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="text-sm font-medium text-gray-900 col-span-2">
                      {profileData.role}
                    </dd>
                  </div>
                  {profileData.bio && (
                    <div className="bg-gray-50 px-6 py-4 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {profileData.bio}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => navigate("/editprofile")}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewProfilePage;