import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentDashboardHeader from "./AdminDashboardHeader";
import fetchData from "../../utils/fetchData";
import UserCard from "../../component/cards/userCard";
import UserForm from "../../component/forms/UserForm";
import LoadingSpinner from "../../component/LoadingSpinner";
import ErrorMessage from "../../component/ErrorMessage";

function UserManagement() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: 'student',
    sslczStoreId: '',
    sslczStorePassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('teachers');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchData("/api/v1/admin/teachers", "/admin/users", setTeachers, setIsLoading, setError, navigate);
      await fetchData("/api/v1/admin/students", "/admin/users", setStudents, setIsLoading, setError, navigate);
    };
    fetchUsers();
  }, []);

  const removeUser = async (userType, id) => {
    try {
      const response = await axios.delete(`/api/v1/admin/remove-user/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.status === 200) {
        if (userType === 'teacher') {
          setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== id));
        } else if (userType === 'student') {
          setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
        }
      }
    } catch (error) {
      setError("Failed to remove user. Please try again.");
    }
  };

  const addUser = async (formData) => {
    try {
      const response = await axios.post("/api/v1/admin/add-user", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.status === 201) {
        setShowForm(false);
        alert('User added successfully');
      }
    } catch (error) {
      setError("Failed to add user. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StudentDashboardHeader />
      
      {/* Modal for user form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
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
              <UserForm 
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 mt-1">Manage all teachers and students</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add User
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}
        
        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teachers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Teachers ({teachers.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Students ({students.length})
            </button>
          </nav>
        </div>

        {/* User Lists */}
        {!isLoading && !error && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {activeTab === 'teachers' && (
              <div className="divide-y divide-gray-200">
                {teachers.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new teacher.</p>
                  </div>
                ) : (
                  teachers.map((teacher) => (
                    <UserCard key={teacher._id} user={teacher} userType="teacher" removeUser={removeUser} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="divide-y divide-gray-200">
                {students.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
                  </div>
                ) : (
                  students.map((student) => (
                    <UserCard key={student._id} user={student} userType="student" removeUser={removeUser} />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;