import React, { useState } from "react";
import { FaUserCircle, FaBell, FaSearch, FaUsersCog, FaClipboardList } from "react-icons/fa";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    "A new user has registered.",
    "A tuition post has been submitted for approval.",
    "Platform Maintenance scheduled for 3:00 AM.",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [users, setUsers] = useState([
    { name: "John Doe", role: "student", email: "john@solvespace.com" },
    { name: "Alice Smith", role: "teacher", email: "alice@solvespace.com" },
  ]);

  const [tuitionPosts, setTuitionPosts] = useState([
    { subject: "Math", postedBy: "John Doe", status: "pending" },
    { subject: "Physics", postedBy: "Alice Smith", status: "approved" },
  ]);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleApprovePost = (index) => {
    const updatedPosts = [...tuitionPosts];
    updatedPosts[index].status = "approved";
    setTuitionPosts(updatedPosts);
    console.log("Tuition post approved:", updatedPosts[index]);
  };

  const handleDeletePost = (index) => {
    const updatedPosts = tuitionPosts.filter((_, i) => i !== index);
    setTuitionPosts(updatedPosts);
    console.log("Tuition post deleted:", index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex-grow mx-4 max-w-2xl relative">
          <div className="flex items-center border rounded-md shadow-sm px-3 py-2 bg-gray-100">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for users, posts, or tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaBell className="text-2xl" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-4 z-10">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Notifications
                </h3>
                <ul className="space-y-2">
                  {notifications.map((note, index) => (
                    <li
                      key={index}
                      className="p-2 bg-gray-50 rounded-md shadow-sm"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu((prev) => !prev)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaUserCircle className="text-2xl" />
            </button>
            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4 z-10">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => console.log("Viewing Profile...")}
                      className="w-full text-left hover:text-indigo-600"
                    >
                      View Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => console.log("Editing Profile...")}
                      className="w-full text-left hover:text-indigo-600"
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => console.log("Logging out...")}
                      className="w-full text-left hover:text-indigo-600"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Management Section */}
      <section className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">User Management</h2>
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Students & Teachers</h3>
            <ul className="space-y-2">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between items-center"
                >
                  <span>{user.name}</span>
                  <span className="text-gray-500">{user.email}</span>
                  <span className="text-sm">{user.role}</span>
                  <button
                    onClick={() => console.log("Editing user...")}
                    className="text-indigo-500 hover:text-indigo-600"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tuition Post Management Section */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Tuition Post Management</h2>
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Pending Posts</h3>
            <ul className="space-y-2">
              {tuitionPosts
                .filter((post) => post.status === "pending")
                .map((post, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between items-center"
                  >
                    <span>{post.subject}</span>
                    <span>{post.postedBy}</span>
                    <span className="text-sm">{post.status}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprovePost(index)}
                        className="text-green-500 hover:text-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeletePost(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Platform Statistics</h2>
          <div className="space-y-2">
            <div>
              <h3 className="text-md font-semibold text-gray-700">Active Users</h3>
              <p>50 users are currently active on the platform.</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700">Total Posts</h3>
              <p>15 posts are available, with 5 pending approval.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
