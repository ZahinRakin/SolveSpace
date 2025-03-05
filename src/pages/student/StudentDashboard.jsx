import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDashboardHeader from "./StudentDashboardHeader.jsx";
import handleLogout from "../../utils/HandleLogout.jsx";

function StudentDashboard() {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Configure axios request with authorization header
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Make API call to fetch recommended courses
        const response = await axios.get('/api/v1/student/dashboard', config);
        
        // Update state with recommended courses
        setRecommendedCourses(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching recommended courses:', err);
        setError(err.message);
        setIsLoading(false);
        
        // Handle unauthorized access (e.g., token expired)
        if (err.response && err.response.status === 403) {
          handleLogout();
        }
      }
    };

    fetchRecommendedCourses();
  }, []);

  // Logout handler
  const onLogout = () => {
    handleLogout();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentDashboardHeader/>
      
      <h1 className="text-2xl font-bold mb-6">Recommended Courses</h1>
      
      {recommendedCourses.length === 0 ? (
        <div className="text-center text-gray-500">
          No recommended courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {recommendedCourses.map((course) => (
            <div 
              key={course._id} 
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {course.title}
                    </h2>
                    <span className="text-sm text-gray-500 capitalize">
                      {course.subject} • {course.class} Class
                    </span>
                  </div>
                  
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {course.is_batch ? 'Batch' : 'Individual'}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {course.owner_id.firstname} {course.owner_id.lastname}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">
                    {course.weekly_schedule.join(', ')} • {course.time}
                  </span>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      {course.max_size} Max Participants
                    </span>
                  </div>
                  
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;