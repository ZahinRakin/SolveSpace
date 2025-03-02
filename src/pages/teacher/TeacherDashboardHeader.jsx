import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useState } from "react";
import handleLogout from "../../utils/HandleLogout.jsx";

function TeacherDashboardHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md p-12 px-24 flex justify-between items-center">
      {/* Header Title */}
      <h1 className="text-xl font-bold text-gray-800">Teacher Dashboard</h1>

      {/* Navigation Menus */}
      <div className="flex space-x-6">
        <Link
          to="/teacher/tuitionpost"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Post
        </Link>
        <Link
          to="/teacher/tuitionsearch"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Search
        </Link>
      </div>

      {/* Notifications and Account Menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button className="text-gray-600 hover:text-gray-800 px-12">
            <Link to="/notification">
              <FaBell className="text-2xl" />
            </Link>
          </button>
        </div>

        {/* Account Menu */}
        <div className="relative">
          {/* Profile Icon */}
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center"
            onClick={() => setShowAccountMenu((prev) => !prev)} // Toggle menu with click
          >
            <FaUserCircle className="text-2xl" />
          </button>

          {/* Dropdown Menu */}
          {showAccountMenu && (
            <div
              className="absolute top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-20 border border-gray-200"
              onMouseEnter={() => setShowAccountMenu(true)} // Keep the menu open when hovering
              onMouseLeave={() => setShowAccountMenu(false)} // Close the menu when cursor leaves
            >
              <ul className="space-y-3">
                <li>
                  <Link to="/viewprofile">
                    <button
                      className="block w-full text-left text-gray-800 hover:bg-indigo-50 p-2 rounded-lg"
                    >
                        View Profile
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/viewprofile">
                    <button
                      className="block w-full text-left text-gray-800 hover:bg-indigo-50 p-2 rounded-lg"
                    >
                        Edit Profile
                    </button>
                  </Link>
                </li>
                <li>
                  <div 
                    className="block w-full text-left text-gray-800 hover:bg-indigo-50 p-2 rounded-lg"
                    onClick={() => handleLogout(navigate)}
                  >
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TeacherDashboardHeader;
