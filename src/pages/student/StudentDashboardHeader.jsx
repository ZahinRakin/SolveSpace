import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaSearch, FaChalkboardTeacher, FaBook, FaUsers, FaTachometerAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import handleLogout from "../../utils/HandleLogout.jsx";
import logo from "/just-logo.png";

function StudentDashboardHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);
  const accountButtonRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
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
    { to: "/student/dashboard", icon: <FaTachometerAlt className="mr-2" />, text: "Dashboard" },
    { to: "/student/tuitionrequest", icon: <FaChalkboardTeacher className="mr-2" />, text: "Post Request" },
    { to: "/student/tutorsearch", icon: <FaSearch className="mr-2" />, text: "Find Tutor" },
    { to: "/student/posts", icon: <FaBook className="mr-2" />, text: "Your Posts" },
    { to: "/student/batches", icon: <FaUsers className="mr-2" />, text: "Your Batches" }
  ];


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

export default StudentDashboardHeader;