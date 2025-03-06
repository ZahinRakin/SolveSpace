import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, UserCheck, FileText, BookOpen, 
} from "lucide-react";
import handleLogout from "../../utils/HandleLogout.jsx";
import AdminDashboardHeader from "./AdminDashboardHeader.jsx";
import LoadingSpinner from "../../component/LoadingSpinner.jsx";
import StatCard from "../../component/cards/StatCard.jsx";
import GrowthCard from "../../component/cards/GrowthCard.jsx";
import ActivityCard from "../../component/cards/ActivityCard.jsx";
import ErrorState from "../../component/states/ErrorState.jsx";

function AdminDashboard() {
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');
        
        const response = await axios.get('/api/v1/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setDashboardInfo(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        if (err.response?.status === 403) handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminDashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users />} 
            title="Students" 
            value={dashboardInfo.stats.total_students} 
            bgColor="bg-blue-500" 
          />
          <StatCard 
            icon={<UserCheck />} 
            title="Teachers" 
            value={dashboardInfo.stats.total_teachers} 
            bgColor="bg-purple-500" 
          />
          <StatCard 
            icon={<FileText />} 
            title="Total Posts" 
            value={dashboardInfo.stats.total_posts} 
            bgColor="bg-green-500" 
          />
          <StatCard 
            icon={<BookOpen />} 
            title="Total Batches" 
            value={dashboardInfo.stats.total_batches} 
            bgColor="bg-amber-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <GrowthCard data={dashboardInfo.growthRates} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ActivityCard 
              title="Recent Posts" 
              icon={<FileText />} 
              items={dashboardInfo.recentPosts} 
              color="blue" 
              dateField="createdAt" 
              titleField="title" 
            />
            <ActivityCard 
              title="Recent Batches" 
              icon={<BookOpen />} 
              items={dashboardInfo.recentBatches} 
              color="amber"
              dateField="createdAt" 
              titleField="subject" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}



export default AdminDashboard;