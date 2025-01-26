import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TuitionRequestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    class: "1",
    days: [],
    time: "",
    duration: "",
    price: "",
    maxBatchSize: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (day) => {
    setFormData((prevData) => {
      const days = prevData.days.includes(day)
        ? prevData.days.filter((d) => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days };
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "/api/v1/teacher/post",
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold ml-4">Tuition Post</h1>
      </header>

      {/* Form */}
      <form
        className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-md rounded-md"
        onSubmit={handlePost}
      >
        <div>
          <label className="block font-semibold">Enter Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Enter Class:</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {[
              ...Array.from({ length: 12 }, (_, i) => i + 1),
              "Hons",
              "Masters",
            ].map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Enter Date:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.days.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Enter Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Enter Duration (in days):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Enter Price (per class):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Enter Max Batch Size:</label>
          <input
            type="number"
            name="maxBatchSize"
            value={formData.maxBatchSize}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default TuitionRequestPage;
