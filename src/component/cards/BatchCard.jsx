import React, { useState } from "react";

const BatchCard = ({ batch, is_editable, setEditableBatch, deleteBatch, show_pay, handlePay }) => {
  const [showStudents, setShowStudents] = useState(false);

  // Fix toggleShowStudents function
  const toggleShowStudents = () => {
    setShowStudents(prevState => !prevState);
  };

  const getStatusBadge = (batch) => {
    if (batch.student_ids && batch.student_ids.length > 0) {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {batch.student_ids.length} Interested
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
            <h2 className="text-xl font-semibold text-gray-900 truncate">{batch.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{batch.subtitle}</p>
          </div>
          {getStatusBadge(batch)}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span className="text-gray-500">Subject:</span> <span className="ml-1 font-medium text-gray-900">{batch.subject}</span></div>
            <div><span className="text-gray-500">Class:</span> <span className="ml-1 font-medium text-gray-900">{batch.class}</span></div>
            <div><span className="text-gray-500">Time:</span> <span className="ml-1 font-medium text-gray-900">{batch.time}</span></div>
            <div><span className="text-gray-500">Salary:</span> <span className="ml-1 font-medium text-gray-900">{batch.salary}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Days:</span> <span className="ml-1 font-medium text-gray-900">{batch.weekly_schedule.join(", ")}</span></div>
          </div>
          
          <div className="pt-2"><p className="text-sm text-gray-500 line-clamp-2">{batch.description}</p></div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {batch.is_continuous && <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Continuous</span>}
            {batch.is_batch && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Batch ({batch.max_size} max)</span>}
          </div>
        </div>
        
        {batch.student_ids?.length > 0 && (
          <div className="mt-4">
            <button onClick={toggleShowStudents} className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
              View {batch.student_ids.length} Students
            </button>
          </div>
        )}
      </div>

      {/* Display batch students */}
      {showStudents && batch.student_ids && (
        <div className="mt-3 bg-gray-50 rounded-md border border-gray-200 p-2 max-h-48 overflow-y-auto">
          <div className="text-xs font-medium text-gray-500 mb-1 px-2">Interested Students</div>
          {batch.student_ids.map(student => (
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
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between">
        {is_editable && (
          <button
            onClick={() => setEditableBatch(batch)}
            className="px-3 py-1.5 border rounded-md text-gray-700 bg-white hover:text-gray-500"
          >
            Edit
          </button>
        )}
        <div className="flex gap-2">
          {show_pay && (
            <button 
              onClick={() => handlePay(batch._id)} 
              className="px-3 py-1.5 border rounded-md text-green-700 bg-green-100 hover:bg-green-200"
            >
              Pay
            </button>
          )}
          <button onClick={() => deleteBatch(batch._id)} className="px-3 py-1.5 border rounded-md text-red-700 bg-red-100 hover:bg-red-200">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;

