import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BatchCard = ({ 
  batch, 
  show_edit_button, handleEdit, 
  show_delete_button, handleDelete, 
  show_ask_button, handleAsk, 
  show_pay_button, handlePay, 
  start_class_button, startClass,
  join_class_button, joinClass,
  delete_student_button, handleDeleteStudent
}) => {
  const [showStudents, setShowStudents] = useState(false);
  const navigate = useNavigate();
  const toggleShowStudents = () => {
    setShowStudents(prevState => !prevState);
  };

  const getStatusBadge = (batch) => {
    if (batch.student_ids && batch.student_ids.length > 0) {
      return (
        <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {batch.student_ids.length} Interested
        </span>
      );
    }
    return (
      <span className="bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Active
      </span>
    );
  };


  return (
    <div className="bg-gray-100 border-2 border-emarald-800 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{batch.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{batch.subtitle}</p>
          </div>
          {getStatusBadge(batch)}
        </div>
        
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
              </svg>
              <span className="text-gray-600 text-sm">Subject:</span> 
              <span className="ml-1.5 font-medium text-gray-900">{batch.subject}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Class:</span> 
              <span className="ml-1.5 font-medium text-gray-900">{batch.class}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Time:</span> 
              <span className="ml-1.5 font-medium text-gray-900">{batch.time}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Salary:</span> 
              <span className="ml-1.5 font-medium text-gray-900">{batch.salary}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-gray-600 text-sm">Days:</span> 
              <span className="ml-1.5 font-medium text-gray-900">{batch.weekly_schedule.join(", ")}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">{batch.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {batch.is_continuous && (
              <span className="bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
                Continuous
              </span>
            )}
            {batch.is_batch && (
              <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                Batch ({batch.max_size} max)
              </span>
            )}
          </div>
          <Link to={`/teacher/profile/${batch?.teacher_id?._id || "67c147c7fcd6e2926309754c"}`} className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300">
            Rate & Review
          </Link>
          {/**showing buttons */}
          <div className="h-[40px] border-t border-gray-100 flex justify-between gap-3">
            {show_edit_button && (
              <button
                onClick={() => handleEdit(batch)}
                className="flex-1 px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            )}
            
            {show_delete_button && (
              <button 
                onClick={() => handleDelete(batch._id)} 
                className="flex-1 px-3 py-1.5 bg-indigo-600  rounded-lg text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            )}

            {show_ask_button && (
              <button
                onClick={() => handleAsk(batch)}
                className="flex-1 px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <img width="30" height="30" src="https://img.icons8.com/ios/50/FFFFFF/receive-cash.png" alt="receive-cash"/>
              </button>
            )}

            {show_pay_button && (
              <button
                onClick={() => handlePay(batch)}
                className="flex-1 px-3 py-1.5 bg-indigo-600 border  rounded-lg text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                
              </button>
            )}

            {start_class_button && (
              <button 
                onClick={() => startClass(batch)} 
                className="flex-1 px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <img src="https://img.icons8.com/?size=100&id=AxR9eK3Gsy99&format=png&color=FFFFFF" className="h-8 w-8" />

              </button>
            )}

            {join_class_button && (
              <button 
                onClick={() => joinClass(batch.join_class_link)} 
                className="flex-1 px-3 py-1.5 bg-indigo-600 text-white  rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              >
                <img src="https://img.icons8.com/?size=100&id=AxR9eK3Gsy99&format=png&color=FFFFFF" className="h-8 w-8" />

              </button>
            )}
          </div>
        </div>



        {/**batch students */}
        {batch.student_ids?.length > 0 && (
          <div className="mt-5">
            <button 
              onClick={toggleShowStudents} 
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {showStudents ? 'Hide' : 'View'} {batch.student_ids.length} Students
              <svg className={`w-4 h-4 ml-1 ${showStudents ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Display batch students */}
      {showStudents && batch.student_ids && (
        <div className="mx-6 mb-5 bg-indigo-50 rounded-lg border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-100 text-indigo-800 text-xs font-medium py-2 px-4">
            Interested Students
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {batch.student_ids.map(student => (
              <div key={student._id} className="flex items-center py-2 px-3 mb-1 bg-white rounded-md shadow-sm">
                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800">{student.username || 'Username not found'}</span>
                {delete_student_button && (
                  <button 
                    onClick={() => handleDeleteStudent(batch._id, student._id)}
                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default BatchCard;