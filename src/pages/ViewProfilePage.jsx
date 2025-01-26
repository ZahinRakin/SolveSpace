import React from "react";
import { useNavigate } from "react-router-dom";

function ViewProfilePage() {
  const navigate = useNavigate();

  const profileData = {
    name: "zahin abdullah",
    email: "zahinabdullah@gmail.com",
    phone: "+123456789",
    address: "14, mohammad ali road, mymensingh",
    role: "Student",
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
        <h1 className="text-xl font-bold ml-4 text-gray-800">View Profile</h1>
      </header>

      {/* Profile Details Section */}
      <div className="flex items-center justify-center mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <p>
              <strong>Phone:</strong> {profileData.phone}
            </p>
            <p>
              <strong>Address:</strong> {profileData.address}
            </p>
            <p>
              <strong>Role:</strong> {profileData.role}
            </p>
          </div>
          <button
            onClick={() => navigate("/editprofile")}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProfilePage;
