import React, { useState } from "react";

function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123456789",
    address: "123 Main Street, City, Country",
    role: "Student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    // Submit to API or process the updated data
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header at the top */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-xl font-bold ml-4 text-gray-800">Edit Profile</h1>
      </header>

      {/* Form Section */}
      <div className="flex items-center justify-center mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
