import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherDashboardHeader from "./TeacherDashBoardHeader";

function ViewBatches() {
  const [ownBatches, setOwnBatches] = useState([]);
  const [partOfBatch, setPartOfBatch] = useState([]);
  const [editableBatch, setEditableBatch] = useState(null);
  const [showStudents, setShowStudents] = useState(null);
  const [studentsData, setStudentsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    fetchBatches();
  }, []);

  async function fetchBatches() {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/batch/batches", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOwnBatches(response.data.data.own);
      setPartOfBatch(response.data.data.partOf);
    } catch (error) {
      if (error.message === "Unauthorized user" || error.response?.status === 401) {
        try {
          const response = await axios.post("/api/v1/refresh-accesstoken", {}, {
            withCredentials: true,
          });
          const accessToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", accessToken);
          const retryResponse = await axios.get("/api/v1/batch/batches", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOwnBatches(retryResponse.data.data.own);
          setPartOfBatch(retryResponse.data.data.partOf);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          setError("Session expired. Please log in again.");
          navigate("/user/batches");
        }
      } else {
        setError("Failed to load batches. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const updateBatch = async (id, updatedData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(`/api/v1/batch/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchBatches();
      setEditableBatch(null); // Close the editable interface
    } catch (error) {
      console.error("Failed to update batch", error);
      alert("Failed to update batch. Please try again.");
    }
  };

  const deleteBatch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/batch/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchBatches();
    } catch (error) {
      console.error("Failed to delete batch", error);
      alert("Failed to delete batch. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "weekly_schedule") {
      // Handle comma-separated schedule
      setEditableBatch((prevBatch) => ({
        ...prevBatch,
        weekly_schedule: value.split(",").map(day => day.trim()),
      }));
    } else if (type === "checkbox") {
      setEditableBatch((prevBatch) => ({
        ...prevBatch,
        [name]: checked,
      }));
    } else {
      setEditableBatch((prevBatch) => ({
        ...prevBatch,
        [name]: value,
      }));
    }
  };

  const handleStudentsClick = async (batchId, studentIds) => {
    if (showStudents === batchId) {
      setShowStudents(null);
    } else {
      setShowStudents(batchId);
      
      if (!studentsData[batchId]) {
        const accessToken = localStorage.getItem("accessToken");
        const studentDetails = {};
        
        for (const studentId of studentIds) {
          try {
            const response = await axios.get(`/api/v1/users/get-user/${studentId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            studentDetails[studentId] = response.data.data;
          } catch (error) {
            console.error(`Failed to fetch student ${studentId}`, error);
            studentDetails[studentId] = { username: "Unknown Student" };
          }
        }
        
        setStudentsData(prev => ({
          ...prev,
          [batchId]: studentDetails
        }));
      }
    }
  };

  async function removeStudent(batch_id, student_id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/batch/remove-user/${batch_id}/${student_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchBatches(); // Refresh batches after removing student
    } catch (error) {
      console.error("Failed to remove student", error);
      alert("Failed to remove student. Please try again.");
    }
  }

  const getBatchStatusBadge = (batch) => {
    if (batch.student_ids && batch.student_ids.length > 0) {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {batch.student_ids.length} Students
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
    <div className="min-h-screen bg-gray-50">
      <TeacherDashboardHeader/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Batches</h1>
          <button
            onClick={() => navigate('/create-batch')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Batch
          </button>
        </div>

        {isLoading && ownBatches.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && ownBatches.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No batches yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new batch.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/create-batch')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create a batch
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ownBatches.map((batch) => (
            <div key={batch._id} className="bg-white overflow-hidden shadow rounded-lg relative">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 truncate">{batch.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">{batch.class}</p>
                  </div>
                  {getBatchStatusBadge(batch)}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-500">Days:</span> 
                      <span className="ml-1 font-medium text-gray-900">{batch.weekly_schedule.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span> 
                      <span className="ml-1 font-medium text-gray-900">{batch.time}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Salary:</span> 
                      <span className="ml-1 font-medium text-gray-900">{batch.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {batch.is_continuous && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Continuous
                      </span>
                    )}
                    {batch.is_batch && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Batch
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handleStudentsClick(batch._id, batch.student_ids)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    View {batch.student_ids.length} batch students
                  </button>
                  
                  {showStudents === batch._id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <h3 className="font-medium text-sm text-gray-700 mb-2">Batch Students</h3>
                      {!studentsData[batch._id] ? (
                        <p className="text-sm text-gray-500">Loading students...</p>
                      ) : (
                        <ul className="space-y-1">
                          {batch.student_ids.map((studentId) => (
                            <li key={studentId} className="text-sm flex justify-between items-center">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {studentsData[batch._id][studentId]?.username || "Unknown Student"}
                              </div>
                              <button 
                                onClick={() => removeStudent(batch._id, studentId)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setEditableBatch(batch)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => deleteBatch(batch._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition duration-150 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {partOfBatch && partOfBatch.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Batches You're Part Of</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partOfBatch.map((batch) => (
                <div key={batch._id} className="bg-white overflow-hidden shadow rounded-lg relative">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 truncate">{batch.subject}</h2>
                        <p className="text-sm text-gray-500 mt-1">{batch.class}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Enrolled
                      </span>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="col-span-2">
                          <span className="text-gray-500">Days:</span> 
                          <span className="ml-1 font-medium text-gray-900">{batch.weekly_schedule.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span> 
                          <span className="ml-1 font-medium text-gray-900">{batch.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editableBatch && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setEditableBatch(null)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Batch
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={editableBatch.subject}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
                        <input
                          type="text"
                          name="class"
                          id="class"
                          value={editableBatch.class}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="weekly_schedule" className="block text-sm font-medium text-gray-700">Weekly Schedule (comma separated)</label>
                        <input
                          type="text"
                          name="weekly_schedule"
                          id="weekly_schedule"
                          value={editableBatch.weekly_schedule.join(", ")}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                          <input
                            type="time"
                            name="time"
                            id="time"
                            value={editableBatch.time}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                          <input
                            type="number"
                            name="salary"
                            id="salary"
                            value={editableBatch.salary}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-6">
                        <div className="flex items-center">
                          <input
                            id="is_continuous"
                            name="is_continuous"
                            type="checkbox"
                            checked={editableBatch.is_continuous}
                            onChange={handleEditChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_continuous" className="ml-2 block text-sm text-gray-900">
                            Continuous
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="is_batch"
                            name="is_batch"
                            type="checkbox"
                            checked={editableBatch.is_batch}
                            onChange={handleEditChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_batch" className="ml-2 block text-sm text-gray-900">
                            Batch
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => updateBatch(editableBatch._id, editableBatch)}
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setEditableBatch(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBatches;