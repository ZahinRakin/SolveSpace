import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TuitionPostPage() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = (day) => {
    setFormData((prevData) => {
      const weekly_schedule = prevData.weekly_schedule.includes(day)
        ? prevData.weekly_schedule.filter((d) => d !== day)
        : [...prevData.weekly_schedule, day];
      return { ...prevData, weekly_schedule };
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "/api/v1/post/create",
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Post submitted successfully!");
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error("Error posting data:", error);
      alert(error.response?.data?.message || "Failed to post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold ml-4">Create Tuition Post</h1>
      </header>

      <form
        className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-md rounded-md"
        onSubmit={handlePost}
      >
        {[
          { label: "Subject", name: "subject", type: "text" },
          { label: "Class", name: "class", type: "text" },
          { label: "Title", name: "title", type: "text" },
          { label: "Subtitle", name: "subtitle", type: "text" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Time", name: "time", type: "time" },
          { label: "Salary", name: "salary", type: "number" },
          { label: "Max Batch Size", name: "max_size", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-semibold">{label}:</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            )}
          </div>
        ))}

        <div>
          <label className="block font-semibold">Weekly Schedule:</label>
          <div className="grid grid-cols-4 gap-2">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.weekly_schedule.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Continuous Class:</label>
          <input
            type="checkbox"
            name="is_continuous"
            checked={formData.is_continuous}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold">Batch Class:</label>
          <input
            type="checkbox"
            name="is_batch"
            checked={formData.is_batch}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default TuitionPostPage;
