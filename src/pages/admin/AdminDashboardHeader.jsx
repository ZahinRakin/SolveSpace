import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaFileAlt, FaChalkboardTeacher, FaBook, FaUsers, FaTachometerAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Added missing axios import
import handleLogout from "../../utils/HandleLogout.jsx";
import logo from "/just-logo.png";

function AdminDashboardHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const menuRef = useRef(null);
  const accountButtonRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    getNotificationCount();
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: "/admin/dashboard", icon: <FaTachometerAlt className="mr-2"/>, text: "Dashboard" },
    { to: "/admin/users", icon: <FaUsers className="mr-2"/>, text: "Users" },
    { to: "/admin/posts", icon: <FaBook className="mr-2"/>, text: "Posts" },
    { to: "/admin/batches", icon: <FaChalkboardTeacher className="mr-2"/>, text: "Batches" },
    { to: "/admin/reports", icon: <FaFileAlt className="mr-2" />, text: "Reports" }
  ];

  async function getNotificationCount() {
    try {
      const response = await axios.get("/api/v1/notifications/getnotifications", {
        withCredentials: true
      });
      setNotificationCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching notification count", error);
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="SolveSpace Logo" 
              className="w-12 h-12 transition-transform duration-300 hover:rotate-6" 
            />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              SolveSpace
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Notifications and Account */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link to="/notification" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">{notificationCount}</span>
            </Link>

            {/* Account Dropdown */}
            <div className="relative ml-3">
              <button
                ref={accountButtonRef}
                className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <FaUserCircle className="text-2xl" />
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <div
                  ref={menuRef}
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-2 px-2" role="menu" aria-orientation="vertical">
                    <Link
                      to="/viewprofile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                      role="menuitem"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/editprofile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                      role="menuitem"
                    >
                      Edit Profile
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                      role="menuitem"
                      onClick={() => handleLogout(navigate)}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminDashboardHeader;