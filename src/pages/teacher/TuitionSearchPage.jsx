import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import TeacherDashboardHeader from "./TeacherDashboardHeader";

function TuitionSearchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    title: "",
    subtitle: "",
    description: "",
    weekly_schedule: [],
    time: "",
    salary: "",
    is_continuous: false,
    is_batch: false,
    max_size: "",
  });
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleScheduleChange = (day) => {
    setFormData((prevData) => {
      const schedule = prevData.weekly_schedule.includes(day)
        ? prevData.weekly_schedule.filter((d) => d !== day)
        : [...prevData.weekly_schedule, day];
      return { ...prevData, weekly_schedule: schedule };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchPerformed(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/post/teacher/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: formData,
      });

      setRequests(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshResponse = await axios.get("/api/v1/refresh-accesstoken", {
            withCredentials: true,
          });
          const accessToken = refreshResponse.headers['authorization'].split(' ')[1];
          localStorage.setItem("accessToken", accessToken);

          const retryResponse = await axios.get("/api/v1/post/teacher/search", {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
            params: formData,
          });

          setRequests(retryResponse.data);
        } catch (refreshError) {
          console.error("Refresh token expired. Logging out...");
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      } else {
        console.error("Error fetching tuition requests:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      class: "",
      title: "",
      subtitle: "",
      description: "",
      weekly_schedule: [],
      time: "",
      salary: "",
      is_continuous: false,
      is_batch: false,
      max_size: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TeacherDashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold ml-4 text-gray-800">Search Students</h1>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Search Form */}
          <div className="md:col-span-4 lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md sticky top-4"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Search Filters</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics, Physics"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class/Level</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  >
                    <option value="">Any Class</option>
                    {[...Array.from({ length: 12 }, (_, i) => i + 1), "Hons", "Masters"].map(
                      (cls) => (
                        <option key={cls} value={cls}>
                          Class {cls}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title of tuition"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description Keywords</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Keywords in description"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Minimum salary"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Batch Size</label>
                  <input
                    type="number"
                    name="max_size"
                    value={formData.max_size}
                    onChange={handleChange}
                    placeholder="Maximum students"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Weekly Schedule</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                      (day) => (
                        <label key={day} className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.weekly_schedule.includes(day)}
                            onChange={() => handleScheduleChange(day)}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-400 rounded border-gray-300"
                          />
                          {day}
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_continuous"
                      checked={formData.is_continuous}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-400 rounded border-gray-300"
                    />
                    <span className="text-sm">Continuous</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_batch"
                      checked={formData.is_batch}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-400 rounded border-gray-300"
                    />
                    <span className="text-sm">Batch</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  "Find Tuitions"
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center justify-between">
                <span>Available Tuition Requests</span>
                {requests.length > 0 && <span className="text-sm font-normal text-gray-500">{requests.length} results found</span>}
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchPerformed && requests.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-700">No matching tuition requests</h3>
                      <p className="mt-2 text-gray-500">Try adjusting your search criteria to find more results.</p>
                    </div>
                  ) : (
                    requests.map((req, index) => (
                      <div key={index} className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{req.title || "Untitled Request"}</h3>
                            <p className="text-sm text-gray-600">{req.subtitle || "No subtitle"}</p>
                          </div>
                          <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {req.is_batch ? "Batch" : "Individual"} Tuition
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 mb-4">
                          <div>
                            <span className="text-xs text-gray-500 block">Subject</span>
                            <span className="font-medium">{req.subject || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Class</span>
                            <span className="font-medium">{req.class || "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Salary</span>
                            <span className="font-medium">{req.salary ? `${req.salary} BDT` : "Not specified"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Schedule</span>
                            <span className="font-medium">{req.weekly_schedule?.length > 0 ? req.weekly_schedule.join(", ") : "Flexible"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Time</span>
                            <span className="font-medium">{req.time || "Flexible"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Duration</span>
                            <span className="font-medium">{req.is_continuous ? "Continuous" : "Fixed Period"}</span>
                          </div>
                        </div>
                        
                        {req.description && (
                          <div className="mb-4">
                            <span className="text-xs text-gray-500 block mb-1">Description</span>
                            <p className="text-sm text-gray-700">{req.description}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition duration-200">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TuitionSearchPage;