import React, { useState } from "react";
import { FaUserCircle, FaBell, FaSearch } from "react-icons/fa";
import Logout from "../../component/Logout";

export default function TeacherDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    "New Application: John Doe has applied for your Math tuition post.",
    "Student Enrollment: Alice has joined your Physics Batch.",
    "Reminder: Update your availability for new students.",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [tuitionPostDetails, setTuitionPostDetails] = useState({
    subject: "",
    time: "",
    sessionType: "session",
  });

  const students = [
    { name: "Alice", subject: "Math" },
    { name: "Bob", subject: "Physics" },
  ];

  const privateTutors = [
    { name: "Dr. Smith", subject: "Math" },
    { name: "Mrs. Johnson", subject: "Physics" },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleTuitionPostSubmit = () => {
    console.log("Tuition Post Details:", tuitionPostDetails);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Teacher Dashboard</h1>
        <div className="flex-grow mx-4 max-w-2xl relative">
          <div className="flex items-center border rounded-md shadow-sm px-3 py-2 bg-gray-100">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for students, subjects, or tutors..."
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
                    <div
                      className="w-full text-left hover:text-indigo-600"
                    >
                      <Logout/>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tuition Post Section */}
      <section className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Create Tuition Post</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={tuitionPostDetails.subject}
                onChange={(e) =>
                  setTuitionPostDetails({ ...tuitionPostDetails, subject: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time (Optional)
              </label>
              <input
                type="text"
                id="time"
                value={tuitionPostDetails.time}
                onChange={(e) =>
                  setTuitionPostDetails({ ...tuitionPostDetails, time: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Type
              </label>
              <select
                value={tuitionPostDetails.sessionType}
                onChange={(e) =>
                  setTuitionPostDetails({ ...tuitionPostDetails, sessionType: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="session">One Session</option>
                <option value="batch">Batch</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleTuitionPostSubmit}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Post Tuition
          </button>
        </div>

        {/* Students Interested Section */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Interested Students</h2>
          <ul className="space-y-2">
            {students.map((student, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between"
              >
                <span>{student.name}</span>
                <span className="text-gray-500">{student.subject}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Private Tutors Section */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Private Tutor Sessions
          </h2>
          <ul className="space-y-2">
            {privateTutors.map((tutor, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between"
              >
                <span>{tutor.name}</span>
                <span className="text-gray-500">{tutor.subject}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
