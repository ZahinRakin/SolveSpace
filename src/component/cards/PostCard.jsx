import React, { useState } from "react";

const PostCard = ({ post, is_editable, setEditablePost, show_delete, deletePost, show_accept_teacher, acceptTeacher, show_join_button, handleJoin, show_leave_button, handleLeave}) => {
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
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {post.interested_students.length} Interested
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
        Active
      </span>
    );
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg relative">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 truncate">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
          </div>
          {getStatusBadge(post)}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span className="text-gray-500">Subject:</span> <span className="ml-1 font-medium text-gray-900">{post.subject}</span></div>
            <div><span className="text-gray-500">Class:</span> <span className="ml-1 font-medium text-gray-900">{post.class}</span></div>
            <div><span className="text-gray-500">Time:</span> <span className="ml-1 font-medium text-gray-900">{post.time}</span></div>
            <div><span className="text-gray-500">Salary:</span> <span className="ml-1 font-medium text-gray-900">{post.salary}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Days:</span> <span className="ml-1 font-medium text-gray-900">{post.weekly_schedule.join(", ")}</span></div>
          </div>
          
          <div className="pt-2"><p className="text-sm text-gray-500 line-clamp-2">{post.description}</p></div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {post.is_continuous && <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Continuous</span>}
            {post.is_batch && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Batch ({post.max_size} max)</span>}
          </div>
        </div>

        {/* Interest buttons */}
        <div className="flex gap-2 mt-4">
          {post.interested_students && post.interested_students.length > 0 && (
            <button
              onClick={toggleInterestedStudents}
              className={`text-xs px-3 py-1.5 rounded-md flex items-center ${
                showInterestedStudents 
                  ? "bg-green-200 text-green-800 border border-green-300" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path>
              </svg>
              {post.interested_students.length} Student{post.interested_students.length !== 1 ? 's' : ''}
              <svg className={`h-4 w-4 ml-1 transform ${showInterestedStudents ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          )}
          
          {post.interested_teachers && post.interested_teachers.length > 0 && (
            <button
              onClick={toggleInterestedTeachers}
              className={`text-xs px-3 py-1.5 rounded-md flex items-center ${
                showInterestedTeachers 
                  ? "bg-blue-200 text-blue-800 border border-blue-300" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
              </svg>
              {post.interested_teachers.length} Teacher{post.interested_teachers.length !== 1 ? 's' : ''}
              <svg className={`h-4 w-4 ml-1 transform ${showInterestedTeachers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Interested students panel */}
        {showInterestedStudents && post.interested_students && post.interested_students.length > 0 && (
          <div className="mt-3 bg-gray-50 rounded-md border border-gray-200 p-2 max-h-48 overflow-y-auto">
            <div className="text-xs font-medium text-gray-500 mb-1 px-2">Interested Students</div>
            {post.interested_students.map(student => (
              <div key={student._id} className="flex items-center py-1.5 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-100 rounded">
                <div className="flex-shrink-0 h-6 w-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-2">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="mt-3 bg-gray-50 rounded-md border border-gray-200 p-2 max-h-48 overflow-y-auto">
            <div className="text-xs font-medium text-gray-500 mb-1 px-2">Interested Teachers</div>
            {post.interested_teachers.map(teacher => (
              <div key={teacher._id} className="flex items-center justify-between py-1.5 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-100 rounded">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-2">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{teacher.username || 'Username not found'}</span>
                </div>
                {show_accept_teacher && (
                  <button 
                    onClick={() => acceptTeacher(teacher._id)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Accept
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between">
        {is_editable && (
          <button
            onClick={() => setEditablePost(post)}
            className="px-3 py-1.5 border rounded-md text-gray-700 bg-white hover:text-gray-500"
          >
            Edit
          </button>
        )}
        {show_join_button && (
          <button
            onClick={() => handleJoin(post._id)}
            className={`joinORleave-${post._id} px-3 py-1.5 border rounded-md text-gray-700 bg-green hover:text-gray-500`}
          >
            Join
          </button>
        )}
        {show_leave_button && (
          <button
            onClick={() => handleLeave(post._id)}
            className={`joinORleave-${post._id} px-3 py-1.5 border rounded-md text-gray-700 bg-green hover:text-gray-500`}
          >
            Leave
          </button>
        )}
        {show_delete && (
          <button 
            onClick={() => deletePost(post._id)} 
            className="px-3 py-1.5 border rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;