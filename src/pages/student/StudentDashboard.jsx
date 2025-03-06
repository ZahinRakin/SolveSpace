import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDashboardHeader from "./StudentDashboardHeader.jsx";
// import handleLogout from "../../utils/HandleLogout.jsx";
import fetchData from "../../utils/fetchData.js";
import ErrorMessage from "../../component/ErrorMessage.jsx";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/LoadingSpinner.jsx";
import PostCard from "../../component/cards/PostCard.jsx";
import { handleJoin, handleLeave } from "../../utils/batchJoin_leave.js";

function StudentDashboard() {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecommendedCourses = async () => {
    const path = '/api/v1/student/dashboard';
    const redirectLink = "student/dashboard";
    await fetchData(path, redirectLink, setRecommendedPosts, setIsLoading, setError, navigate);
  };

  useEffect(() => {
    fetchRecommendedCourses();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div>
        <StudentDashboardHeader/>
        <LoadingSpinner/>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentDashboardHeader/>
        <ErrorMessage message={error}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentDashboardHeader/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Recommended Posts</h1>
        </div>

        {recommendedPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No recommended posts</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for personalized recommendations.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                is_editable={false}
                setEditablePost={()=>{}}
                show_delete={false}
                deletePost={()=>{}}
                show_accept_teacher={false}
                acceptTeacher={()=>{}}
                show_join_button={true}
                handleJoin={(post_id)=>handleJoin(post_id, setIsLoading, setError, fetchRecommendedCourses)}
                show_leave_button={true}
                handleLeave={(post_id)=>handleLeave(post_id, setIsLoading, setError, fetchRecommendedCourses)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;