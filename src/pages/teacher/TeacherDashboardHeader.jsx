import { Link } from "react-router-dom";
import Logout from "../../component/Logout";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useState } from "react";

function TeacherDashboardHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
        <div
          className="relative"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          <button className="text-gray-600 hover:text-gray-800">
            <FaUserCircle className="text-2xl" />
          </button>
          {showAccountMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4 z-10">
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
                  <div className="w-full text-left hover:text-indigo-600">
                    <Logout />
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
