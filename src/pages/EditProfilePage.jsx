import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    coverImage: null, // File upload
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async (accessToken) => {
      try {
        const response = await axios.get("/api/v1/users/viewprofile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { firstname, lastname, username, email } = response.data.data;
        setFormData({ firstname, lastname, username, email, coverImage: null });
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          await handleRefreshToken();
        } else {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile.");
          setLoading(false);
        }
      }
    };

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(accessToken);
    } else {
      navigate("/login");
    }
  }, []);

  // Refresh access token
  const handleRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newAccessToken = response.data.newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      await fetchProfile(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate("/login");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const accessToken = localStorage.getItem("accessToken");
    const formDataObj = new FormData();
    formDataObj.append("firstname", formData.firstname);
    formDataObj.append("lastname", formData.lastname);
    formDataObj.append("username", formData.username);
    formDataObj.append("email", formData.email);
    if (formData.coverImage) {
      formDataObj.append("coverImage", formData.coverImage);
    }

    try {
      const response = await axios.put("/api/v1/users/updateprofile", formDataObj, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-xl font-bold ml-4 text-gray-800">Edit Profile</h1>
      </header>

      {/* Loading & Error Handling */}
      <div className="flex items-center justify-center mt-8">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"

          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditProfilePage;
