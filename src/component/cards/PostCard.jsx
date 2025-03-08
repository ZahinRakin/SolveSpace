import React, { useState } from "react";

const PostCard = ({ 
  post, 
  is_editable, 
  setEditablePost, 
  show_delete, 
  deletePost, 
  show_accept_teacher, 
  acceptTeacher, 
  show_join_button, 
  handleJoin, 
  show_leave_button, 
  handleLeave
}) => {
  const [showInterestedStudents, setShowInterestedStudents] = useState(false);
  const [showInterestedTeachers, setShowInterestedTeachers] = useState(false);

  const toggleInterestedStudents = () => {
    setShowInterestedStudents(!showInterestedStudents);
    if (showInterestedTeachers) setShowInterestedTeachers(false);
  };

  const toggleInterestedTeachers = () => {
    setShowInterestedTeachers(!showInterestedTeachers);
    if (showInterestedStudents) setShowInterestedStudents(false);
  };

  const getStatusBadge = (post) => {
    if (post.interested_students && post.interested_students.length > 0) {
      return (
        <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
          {post.interested_students.length} Interested
        </span>
      );
    }
    return (
      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
        Active
      </span>
    );
  };

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 transition-all hover:shadow-lg">
      <div className="px-6 py-5">
        {/* Header with Title and Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
          </div>
          {getStatusBadge(post)}
        </div>
        
        {/* Details Grid */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span className="text-gray-600 text-sm">Subject:</span> 
              <span className="ml-2 font-medium text-gray-900">{post.subject}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span className="text-gray-600 text-sm">Class:</span> 
              <span className="ml-2 font-medium text-gray-900">{post.class}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Time:</span> 
              <span className="ml-2 font-medium text-gray-900">{post.time}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Salary:</span> 
              <span className="ml-2 font-medium text-gray-900">{post.salary}</span>
            </div>
            
            <div className="col-span-2 flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Days:</span> 
              <span className="ml-2 font-medium text-gray-900">{post.weekly_schedule.join(", ")}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.is_continuous && 
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              Continuous
            </span>
          }
          {post.is_batch && 
            <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1z"></path>
              </svg>
              Batch ({post.max_size} max)
            </span>
          }
        </div>

        {/* Interest buttons */}
        <div className="flex gap-2">
          {post.interested_students && post.interested_students.length > 0 && (
            <button
              onClick={toggleInterestedStudents}
              className={`text-xs px-3 py-2 rounded-md flex items-center transition-all ${
                showInterestedStudents 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path>
              </svg>
              {post.interested_students.length} Student{post.interested_students.length !== 1 ? 's' : ''}
              <svg className={`h-4 w-4 ml-1.5 transform transition-transform ${showInterestedStudents ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          )}
          
          {post.interested_teachers && post.interested_teachers.length > 0 && (
            <button
              onClick={toggleInterestedTeachers}
              className={`text-xs px-3 py-2 rounded-md flex items-center transition-all ${
                showInterestedTeachers 
                  ? "bg-blue-100 text-blue-700 border border-blue-200" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
              </svg>
              {post.interested_teachers.length} Teacher{post.interested_teachers.length !== 1 ? 's' : ''}
              <svg className={`h-4 w-4 ml-1.5 transform transition-transform ${showInterestedTeachers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Interested students panel */}
        {showInterestedStudents && post.interested_students && post.interested_students.length > 0 && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm p-3 max-h-48 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Interested Students</div>
            {post.interested_students.map(student => (
              <div key={student._id} className="flex items-center py-2 px-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex-shrink-0 h-7 w-7 bg-green-50 text-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{student.username || 'Username not found'}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Interested teachers panel */}
        {showInterestedTeachers && post.interested_teachers && post.interested_teachers.length > 0 && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm p-3 max-h-48 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Interested Teachers</div>
            {post.interested_teachers.map(teacher => (
              <div key={teacher._id} className="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-7 w-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{teacher.username || 'Username not found'}</span>
                </div>
                {show_accept_teacher && (
                  <button 
                    onClick={() => acceptTeacher(post._id, teacher._id)}
                    className="text-xs px-3 py-1.5 bg-green-50 text-green-600 font-medium rounded-md hover:bg-green-100 border border-green-200 transition-colors"
                  >
                    Accept
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between">
        <div className="space-x-2">
          {is_editable && (
            <button
              onClick={() => setEditablePost(post)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit
              </div>
            </button>
          )}
          {show_delete && (
            <button 
              onClick={() => deletePost(post._id)} 
              className="px-4 py-2 border border-red-200 rounded-md text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </div>
            </button>
          )}
        </div>
        <div>
          {show_join_button && (
            <button
              onClick={() => handleJoin(post._id)}
              className={`joinORleave-${post._id} px-4 py-2 border border-blue-500 rounded-md text-white bg-blue-500 hover:bg-blue-600 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Join
              </div>
            </button>
          )}
          {show_leave_button && (
            <button
              onClick={() => handleLeave(post._id)}
              className={`joinORleave-${post._id} px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Leave
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;