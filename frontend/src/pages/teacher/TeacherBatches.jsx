import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherDashboardHeader from "./TeacherDashboardHeader";
import ErrorMessage from "../../component/ErrorMessage.jsx";
import LoadingSpinner from "../../component/LoadingSpinner.jsx";
import fetchData from "../../utils/fetchData.js";
import BatchCard from "../../component/cards/BatchCard.jsx";
import getUser from "../../utils/getUser.js";
import BatchForm from "../../component/forms/BatchForm.jsx";

function StudentBatches() {
  const [ownBatches, setOwnBatches] = useState([]);
  const [partOfBatch, setPartOfBatch] = useState([]);
  const [editableBatch, setEditableBatch] = useState(null);
  const [showStudents, setShowStudents] = useState(null);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "", 
    teacher_username: "", 

    subject: "",

    class: "",
    
    weekly_schedule: [],
    time: "13:00",
    salary: 0,
    time_to_pay: false,

    is_continuous: false,
    is_batch: false,
    student_ids:[]
  });
  // const [studentsData, setStudentsData] = useState({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    getUser(setUser);
    fetchBatches();
  }, []); 

  const addBatch = async (formData) => {
    try {
      const response = await axios.post("/api/v1/batch/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.status >= 200 && response.status <=300) {
        setShowForm(false);
        alert('Batch created successfully');
        await fetchBatches();
      }
    } catch (error) {
      setError("Failed to create batch. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBatch(formData);
  };

  async function fetchBatches () {
    const path = "/api/v1/batch/batches";
    const redirectLink = "/student/batches";
    await fetchData(path, redirectLink, setBatches, setIsLoading, setError, navigate);
  };

  useEffect(() => {
    if (batches.length > 0) {
      const own = batches.filter(batch => batch.owner_id._id === user._id);
      const part = batches.filter(batch => batch.student_ids.some(st => st._id === user._id));
      
      setOwnBatches(own);
      setPartOfBatch(part);
    }
  }, [batches]);


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
      await axios.delete(`/api/v1/batch/destroy/${id}`, {
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


  async function askForPay(batch){
    setIsLoading(true);
    const path = `/api/v1/batch/teacher/ask-for-payment/${batch._id}`;

    try {
      const response = await axios.post(path, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
    } catch (error) {
      console.error("error while asked for payment: ", error.message);
      <ErrorMessage message={error.message}/>
    } finally {
      setIsLoading(false);
    }
    
  }

  async function startClass(batch) {
    const path = `/api/v1/zoom/create-meeting/${batch._id}`;

    try {
      setIsLoading(true);
      const response = await axios.post(path, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      const startUrl = response.data.data.startUrl

      window.open(startUrl, "_blank");
    } catch (error) {
      console.error("Error while starting class: ", error.message);
      <ErrorMessage message={error.message}/>
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div>
        <TeacherDashboardHeader/>
        <LoadingSpinner/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherDashboardHeader/>
        <ErrorMessage message={error}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherDashboardHeader/>
      {/*Modal for batch form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[80vh] overflow-auto transform transition-all">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Add New Batch</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BatchForm
                formData={formData} 
                setFormData={setFormData} 
                passwordVisible={passwordVisible} 
                setPasswordVisible={setPasswordVisible} 
                handleSubmit={handleSubmit} 
              />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Batches</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Batch
          </button>
        </div>

        {!isLoading && ownBatches.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No batches yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new batch.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create a batch
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ownBatches.map((batch) => (
            <BatchCard
              key={batch._id}
              batch={batch}

              show_edit_button={true}
              handleEdit={setEditableBatch}

              show_delete_button={true}
              handleDelete={deleteBatch}

              show_ask_button={true}
              handleAsk={askForPay}

              show_pay_button={false}
              handlePay={null}

              start_class_button={true} 
              startClass={startClass}

              join_class_button={false}
              joinClass={null}

              delete_student_button={false}
              handleDeleteStudent={null}
            />
          ))}
        </div>

        {partOfBatch && partOfBatch.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Batches You're Part Of</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partOfBatch.map((batch) => (
                <BatchCard
                  key={batch._id}
                  batch={batch}

                  show_edit_button={false}
                  handleEdit={null}

                  show_delete_button={true}
                  handleDelete={deleteBatch}

                  show_ask_button={true}
                  handleAsk={askForPay}

                  show_pay_button={false}
                  handlePay={null}

                  start_class_button={true} 
                  startClass={startClass}

                  join_class_button={false}
                  joinClass={null}

                  delete_student_button={false}
                  handleDeleteStudent={null}
                />
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

export default StudentBatches;