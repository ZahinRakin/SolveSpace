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
import EditPostModal from "../../component/modals/EditPostModal.jsx";


function StudentPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [editablePost, setEditablePost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser(setUser);
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
      setError("Failed to delete post. Please try again.: ", error.message);
    }finally{
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "weekly_schedule") {
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

  function doesOwnPost(post_id){
    return post_id === user._id;
  }
  function isInPost(interested_students) {
    return interested_students.some(st => st._id === user._id);
  }

  if (isLoading) {
    return (
      <div>
        <StudentDashboardHeader/>
        <LoadingSpinner/>
      </div>
    );
  }

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
                onClick={() => navigate("/student/posts")}
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
              is_editable={doesOwnPost(post.owner_id._id)}
              setEditablePost={setEditablePost}
              show_delete={doesOwnPost(post.owner_id._id)}
              deletePost={deletePost}
              show_accept_teacher={doesOwnPost(post.owner_id._id)}
              acceptTeacher={acceptTeacher}
              show_join_button={false}//!doesOwnPost(post.owner_id._id) && !isInPost(post.interested_students)
              handleJoin={null}//(post_id)=>handleJoin(post._id, user.role, setIsLoading, setError, fetchPosts)
              show_leave_button={!doesOwnPost(post.owner_id._id) && isInPost(post.interested_students)}
              handleLeave={(post_id)=>handleLeave(post._id, user.role, setIsLoading, setError, fetchPosts)}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <EditPostModal
        editablePost={editablePost}
        handleEditChange={handleEditChange}
        updatePost={updatePost}
        setEditablePost={setEditablePost}
      />
    </div>
  );
}

export default StudentPosts;