import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardHeader from "./AdminDashboardHeader.jsx";
import handleLogout from "../../utils/HandleLogout.jsx";
import { 
  Users, 
  UserCheck, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  Loader,
  Clock
} from "lucide-react";

function AdminDashboard() {
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminDashboardInfo();
  }, []);

  async function fetchAdminDashboardInfo() {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('/api/v1/admin/dashboard', config);

      setDashboardInfo(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      setIsLoading(false);

      if (err.response && err.response.status === 403) {
        handleLogout();
      }
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-12 w-12 text-indigo-500" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Stats */}
          <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Total Stats</h3>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-2" />
                <p><strong>Total Students:</strong> {dashboardInfo.stats.total_students}</p>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 text-gray-500 mr-2" />
                <p><strong>Total Teachers:</strong> {dashboardInfo.stats.total_teachers}</p>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                <p><strong>Total Posts:</strong> {dashboardInfo.stats.total_posts}</p>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                <p><strong>Total Batches:</strong> {dashboardInfo.stats.total_batches}</p>
              </div>
            </div>
          </div>

          {/* Growth Rates */}
          <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Growth Rates</h3>
            </div>
            {dashboardInfo.growthRates ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <p>
                    <strong>Student Growth:</strong> 
                    <span className={dashboardInfo.growthRates.studentGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                      {dashboardInfo.growthRates.studentGrowth !== undefined
                        ? ' ' + dashboardInfo.growthRates.studentGrowth.toFixed(2) + '%'
                        : ' No data'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 text-gray-500 mr-2" />
                  <p>
                    <strong>Teacher Growth:</strong> 
                    <span className={dashboardInfo.growthRates.teacherGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                      {dashboardInfo.growthRates.teacherGrowth !== undefined
                        ? ' ' + dashboardInfo.growthRates.teacherGrowth.toFixed(2) + '%'
                        : ' No data'}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No growth data available</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-gray-700 mr-2" />
            <h3 className="text-2xl font-semibold">Recent Activity</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-4">
            {/* Recent Posts */}
            <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold ml-3">Recent Posts</h4>
              </div>
              <ul className="mt-4 divide-y divide-gray-100">
                {dashboardInfo.recentPosts.map((post, index) => (
                  <li key={index} className="py-3">
                    <p className="text-gray-700 font-medium">{post.title}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Batches */}
            <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold ml-3">Recent Batches</h4>
              </div>
              <ul className="mt-4 divide-y divide-gray-100">
                {dashboardInfo.recentBatches.map((batch, index) => (
                  <li key={index} className="py-3">
                    <p className="text-gray-700 font-medium">{batch.subject}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;