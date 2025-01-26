import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TutorSearchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    date: "",
    time: "",
    perClassPay: "",
  });
  const [requests, setRequests] = useState([ 
    {
      name: "Zahin Abdullah Rakin",
      subject: "physics",
      class: 'Hons',
      date: ['saturday', 'sunday', 'monday'],
      duration: 180, //days
      per_class_pay: 300 
    },{
      name: "Zahin Abdullah Rakin",
      subject: "physics",
      class: 'Hons',
      date: ['saturday', 'sunday', 'monday'],
      duration: 180, //days
      per_class_pay: 300 
    },{
      name: "Zahin Abdullah Rakin",
      subject: "physics",
      class: 'Hons',
      date: ['saturday', 'sunday', 'monday'],
      duration: 180, //days
      per_class_pay: 300 
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/student/request", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: formData, // Filter based on filled inputs
      });
      setRequests(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          // Refresh the access token
          const refreshResponse = await axios.get("/api/v1/refresh-accesstoken", {
            withCredentials: true, // To send cookies
          });
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);

          // Retry the original request
          const retryResponse = await axios.get("/api/v1/student/request", {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
            params: formData,
          });
          setRequests(retryResponse.data);
        } catch (refreshError) {
          console.error("Refresh token expired. Logging out...");
          alert("Session expired. Please log in again.");
          navigate('/login');
        }
      } else {
        console.error("Error fetching tuition requests:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold ml-4">Tuition Search</h1>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-md max-w-2xl mx-auto mb-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
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
            <label className="block font-semibold">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Per Class Pay:</label>
            <input
              type="number"
              name="perClassPay"
              value={formData.perClassPay}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
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

      {/* Tutor Requests */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Tutor Requests</h2>
        <div className="grid gap-4">
          {requests.length > 0 ? (
            requests.map((req, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-md rounded-md"
              >
                <p>
                  <strong>Name:</strong> {req.name}
                </p>
                <p>
                  <strong>Subject:</strong> {req.subject}
                </p>
                <p>
                  <strong>Class:</strong> {req.class}
                </p>
                <p>
                  <strong>Days:</strong> {req.date.join(", ")}
                </p>
                <p>
                  <strong>Duration:</strong> {req.duration} days
                </p>
                <p>
                  <strong>Pay per Class:</strong> ${req.per_class_pay}
                </p>
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

export default TutorSearchPage;
