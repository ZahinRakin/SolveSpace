import React from "react";


const PostCard = ({ post, is_editable, setEditablePost, deletePost, handleInterestedStudentsClick }) => {
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
        
        {post.interested_students?.length > 0 && (
          <div className="mt-4">
            <button onClick={() => handleInterestedStudentsClick(post.interested_students)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
              View {post.interested_students.length} interested students
            </button>
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
        <button onClick={() => deletePost(post._id)} className="px-3 py-1.5 border rounded-md text-red-700 bg-red-100 hover:bg-red-200">Delete</button>
      </div>
    </div>
  );
};

export default PostCard;
