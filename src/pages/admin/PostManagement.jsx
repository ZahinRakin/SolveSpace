import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardHeader from "./AdminDashboardHeader";
import fetchData from "../../utils/fetchData"

import PostForm from "../../component/forms/PostForm";
import PostCard from "../../component/cards/PostCard";
import LoadingSpinner from "../../component/LoadingSpinner";
import ErrorMessage from "../../component/ErrorMessage";

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    owner_id: "",
    owner: "",

    subject: "",
    class: "",

    title: "",
    subtitle: "",
    description: "",

    weekly_schedule: [],
    time: "10:00 AM",
    salary: 0, 

    is_continuous: false,
    is_batch: false,
    max_size: 2,

    interested_teachers: [],
    interested_students: []
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const path = "/api/v1/admin/posts";
  const redirectLink = "/admin/posts";
  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData(path, redirectLink, setPosts, setIsLoading, setError, navigate);
    };
    
    fetchDataAsync();
  }, []);

  const addPost = async () => {
    console.log("inside add post: ",formData); //here formData has attribures and values
    console.log("inside add post: formdata instance: ", typeof formData); //debugging log
    try {
      const response = await axios.post("/api/v1/admin/add-post", formData, { // but when i send it to the backend it shows undefined
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.status === 201) {
        setShowForm(false);
        alert('User added successfully');
      }
    } catch (error) {
      setError("Failed to add Post. Please try again.");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/admin/remove-post/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      await fetchData(path, redirectLink, setPosts, setIsLoading, setError, navigate);
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader/>
      {/*Modal for post form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[80vh] overflow-auto transform transition-all">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Add New Post</h3>
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
              <PostForm
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
          <h1 className="text-2xl font-bold text-gray-900">Post Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Post
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

        {!isLoading && posts.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create a post
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              is_editable={false}
              setEditablePost={()=>{}}
              deletePost={deletePost}
              show_accept_teacher={false}
              acceptTeacher={()=>{}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostManagement;