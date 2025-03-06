import axios from "axios";
import { useEffect, useState } from "react";
import ErrorMessage from "../../component/ErrorMessage.jsx";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/LoadingSpinner.jsx";
import StudentDashboardHeader from "./StudentDashboardHeader";
import PostCard from "../../component/cards/PostCard.jsx";
import fetchData from "../../utils/fetchData.js";
import getUser from "../../utils/getUser.js";
import { handleJoin, handleLeave } from "../../utils/batchJoin_leave.js";


function StudentPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [editablePost, setEditablePost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser(setUser);
    console.log("studentposts: user: ", user); //debugging log
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const path = "/api/v1/post/posts";
    const redirectLink = "student/posts"
    await fetchData(path, redirectLink, setUserPosts, setIsLoading, setError, navigate);
  }

  const updatePost = async (id, updatedData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(`/api/v1/post/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchPosts();
      setEditablePost(null);
    } catch (error) {
      console.error("Failed to update post", error);
      alert("Failed to update post. Please try again.");
    }
  };


  async function acceptTeacher(post_id, userTeacher_id){
    try{
      setIsLoading(true);
      await axios.post(`/api/v1/post/student/accept/${post_id}/${userTeacher_id}`,{},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      await fetchPosts();
    }catch(error){
      console.error("Error accepting teacher: ", error);
      setError("Failed to accept teacher.");
    }finally{
      setIsLoading(false);
    }
  }

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/post/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "weekly_schedule") {
      // Handle comma-separated schedule
      setEditablePost((prevPost) => ({
        ...prevPost,
        weekly_schedule: value.split(",").map(day => day.trim()),
      }));
    } else if (type === "checkbox") {
      setEditablePost((prevPost) => ({
        ...prevPost,
        [name]: checked,
      }));
    } else {
      setEditablePost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  function doesOwnPost(owner_id){
    return (owner_id === user._id);
  }

  // Loading State
  if (isLoading) {
    return (
      <div>
        <StudentDashboardHeader/>
        <LoadingSpinner/>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentDashboardHeader/>
        <ErrorMessage message={error}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentDashboardHeader/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Tuition Posts</h1>
          <button
            onClick={() => navigate('/create-post')} //have to construct
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Post
          </button>
        </div>

        {!isLoading && userPosts.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new tuition post.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/create-post')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create a post
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              is_editable={true}
              setEditablePost={setEditablePost}
              show_delete={doesOwnPost(post.owner_id)}
              deletePost={deletePost}
              show_accept_teacher={doesOwnPost(post.owner_id)}
              acceptTeacher={acceptTeacher}
              show_join_button={!doesOwnPost(post.owner_id)}
              handleJoin={(post_id)=>handleJoin(post_id, setIsLoading, setError, fetchPosts)}
              show_leave_button={!doesOwnPost(post.owner_id)}
              handleLeave={(post_id)=>handleLeave(post_id, setIsLoading, setError, fetchPosts)}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editablePost && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setEditablePost(null)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Tuition Post
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={editablePost.title}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                        <input
                          type="text"
                          name="subtitle"
                          id="subtitle"
                          value={editablePost.subtitle}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={editablePost.subject}
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
                            value={editablePost.class}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          id="description"
                          rows="3"
                          value={editablePost.description || ""}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="weekly_schedule" className="block text-sm font-medium text-gray-700">Weekly Schedule (comma separated)</label>
                        <input
                          type="text"
                          name="weekly_schedule"
                          id="weekly_schedule"
                          value={editablePost.weekly_schedule.join(", ")}
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
                            value={editablePost.time}
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
                            value={editablePost.salary}
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
                            checked={editablePost.is_continuous}
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
                            checked={editablePost.is_batch}
                            onChange={handleEditChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_batch" className="ml-2 block text-sm text-gray-900">
                            Batch
                          </label>
                        </div>
                      </div>
                      {editablePost.is_batch && (
                        <div>
                          <label htmlFor="max_size" className="block text-sm font-medium text-gray-700">Max Batch Size</label>
                          <input
                            type="number"
                            name="max_size"
                            id="max_size"
                            value={editablePost.max_size}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => updatePost(editablePost._id, editablePost)}
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setEditablePost(null)}
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

export default StudentPosts;