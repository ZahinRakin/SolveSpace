import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold ml-4">Tuition Search</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-md max-w-2xl mx-auto mb-6"
      >
        <div className="space-y-4">
          {[
            { label: "Subject", name: "subject", type: "text" },
            { label: "Title", name: "title", type: "text" },
            { label: "Subtitle", name: "subtitle", type: "text" },
            { label: "Description", name: "description", type: "text" },
            { label: "Time", name: "time", type: "time" },
            { label: "Salary", name: "salary", type: "number" },
            { label: "Max Batch Size", name: "max_size", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block font-semibold">{label}:</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold">Class:</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Any</option>
              {[...Array.from({ length: 12 }, (_, i) => i + 1), "Hons", "Masters"].map(
                (cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Weekly Schedule:</label>
            <div className="grid grid-cols-4 gap-2">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                (day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.weekly_schedule.includes(day)}
                      onChange={() => handleScheduleChange(day)}
                      className="mr-2"
                    />
                    {day}
                  </label>
                )
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className="block font-semibold mr-4">Continuous:</label>
            <input
              type="checkbox"
              name="is_continuous"
              checked={formData.is_continuous}
              onChange={handleChange}
              className="mr-2"
            />
          </div>

          <div className="flex items-center">
            <label className="block font-semibold mr-4">Batch:</label>
            <input
              type="checkbox"
              name="is_batch"
              checked={formData.is_batch}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Tutor Requests</h2>
        <div className="grid gap-4">
          {requests.length > 0 ? (
            requests.map((req, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-md">
                {Object.entries(req).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p>No requests found based on your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TuitionSearchPage;
