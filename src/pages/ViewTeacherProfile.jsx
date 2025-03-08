import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../component/LoadingSpinner";
import ErrorMessage from "../component/ErrorMessage";
import { useEffect, useState } from "react";
import getUser from "../utils/getUser";
import fetchData from "../utils/fetchData";
import RatingModal from "../component/modals/RatingModal";
import ReviewModal from "../component/modals/ReviewModal";
import ReportModal from "../component/modals/ReportModal";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function ViewTeacherProfile() {
  const { teacher_id } = useParams();

  console.log("teacher_id", typeof teacher_id);//debugging log

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [teacherAvgRating, setTeacherAvgRating] = useState(0);
  const [teacherReviews, setTeacherReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("rating");

  useEffect(() => {
    getUser(setUser);
    getTeacher(teacher_id);
  }, [teacher_id]);

  useEffect(() => {
    if (teacher._id) {
      getReviews();
      getAvgRating();
    }
  }, [teacher]);

  useEffect(()=>{
    console.log("teacher average rating: ", teacherAvgRating); //debugging log. //here I am getting the value. but later when i am printing it it is printing NaN
  }, [teacherAvgRating]);

  async function getTeacher() {
    const path = `/api/v1/users/get-user/${teacher_id}`;
    await fetchData(path, `/teacher/profile/${teacher_id}`, setTeacher, setIsLoading, setError, navigate);
  }

  async function getReviews() {
    const path = `/api/v1/rating/view-reviews/${teacher._id}`;
    await fetchData(path, `/teacher/profile/${teacher_id}`, setTeacherReviews, setIsLoading, setError, navigate);
  }

  async function getAvgRating() {
    const path = `/api/v1/rating/get-rating/${teacher._id}`;
    await fetchData(path, `/teacher/profile/${teacher_id}`, setTeacherAvgRating, setIsLoading, setError, navigate);
  }



  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="px-16 py-8 flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <FiArrowLeft className="inline mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold ml-4 text-gray-800">Reports And Reviews</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {/* Teacher Profile Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <div className="mr-4">
              {teacher.coverImage ? (
                <img 
                  src={teacher.coverImage} 
                  alt={`${teacher.firstname}'s profile`} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {teacher.firstname?.[0]}{teacher.lastname?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{teacher.firstname} {teacher.lastname}</h2>
              <p className="text-gray-600">@{teacher.username}</p>
              <p className="text-gray-600">{teacher.email}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(teacherAvgRating.averageRating) 
                          ? "text-yellow-400" 
                          : "text-gray-300"
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{Number(teacherAvgRating.averageRating).toFixed(1)}</span> {/**why this isn't prinnting. but I am getting this from the backend */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "rating"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("rating")}
          >
            Rate Teacher
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            View Reviews
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "report"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("report")}
          >
            Report Teacher
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "rating" && <RatingModal teacherId={teacher._id} onRatingSubmit={getAvgRating} />}
          {activeTab === "reviews" && <ReviewModal reviews={teacherReviews} userId={user.id} teacherId={teacher._id} onReviewUpdate={getReviews} />}
          {activeTab === "report" && <ReportModal teacherId={teacher._id} />}
        </div>
      </main>
    </div>
  );
}


export default ViewTeacherProfile;