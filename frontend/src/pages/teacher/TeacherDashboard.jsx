import React, { useState, useEffect } from "react";
import TeacherDashboardHeader from "./TeacherDashboardHeader.jsx";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/v1/teacher/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (error) {
        if (error.message === "Unauthorized user" || error.response?.status === 401) {
          try {
            const refreshResponse = await axios.post("/api/v1/refresh-accesstoken", {}, {
              withCredentials: true,
            });
            const accessToken = refreshResponse.data.data.accessToken;
            localStorage.setItem("accessToken", accessToken);
            
            const retryResponse = await axios.get("/api/v1/teacher/dashboard", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setDashboardData(retryResponse.data.data);
            setLoading(false);
          } catch (refreshError) {
            console.error("Failed to refresh token", refreshError);
            // Note: 'navigate' was not defined in the original code
            // You might want to import useNavigate from react-router-dom
            // const navigate = useNavigate();
            // navigate("/teacher/login");
            window.location.href = "/teacher/login";
          }
        } else {
          console.error("Error fetching dashboard data:", error);
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, []);

  // Format rating distribution data for the chart
  const formatRatingData = () => {
    if (!dashboardData?.ratingDistribution) return [];
    
    return Object.entries(dashboardData.ratingDistribution)
      .map(([star, count]) => ({ 
        star: `${star} ⭐`, 
        count,
        fill: getRatingColor(parseInt(star)) 
      }))
      .sort((a, b) => parseInt(a.star) - parseInt(b.star));
  };

  // Get different colors for different ratings
  const getRatingColor = (rating) => {
    const colors = {
      1: "#f87171", // red
      2: "#fb923c", // orange
      3: "#facc15", // yellow
      4: "#a3e635", // light green
      5: "#22c55e"  // green
    };
    return colors[rating] || "#fbbf24";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4 font-medium">Loading dashboard...</p>
        <div className="bg-white p-6 rounded-lg shadow-md w-3/4 mt-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-16 bg-gray-100 rounded mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-6xl">😕</p>
        <p className="text-gray-600 mt-4 text-xl">No dashboard data available</p>
        <button 
          className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300" 
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherDashboardHeader />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Average Rating Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Average Rating</h2>
            <div className="flex items-baseline">
              <p className="text-5xl font-bold text-yellow-500">{parseFloat(dashboardData.averageRating).toFixed(1)}</p>
              <p className="ml-2 text-2xl text-yellow-500">⭐</p>
            </div>
            <p className="text-gray-500 mt-2">Based on {dashboardData.reviews?.length || 0} reviews</p>
          </div>
          
          {/* Quick Stats Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-700">{dashboardData.totalStudents || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Active Courses</p>
                <p className="text-2xl font-bold text-green-700">{dashboardData.activeCourses || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rating Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Rating Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatRatingData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="star" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} reviews`, 'Count']}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Recent Reviews</h2>
            <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">View All</button>
          </div>
          
          {dashboardData.reviews?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.reviews.map((review, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span className="text-gray-500 font-medium">{review.studentInitials || 'S'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{review.studentName || 'Student'}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">{Array(review.rating).fill('⭐').join('')}</span>
                        <span className="text-gray-500 text-sm">({review.date})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 pl-13">{review.review}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;