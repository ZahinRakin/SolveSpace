import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaSearch, FaChalkboardTeacher, FaBook, FaUsers } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import handleLogout from "../../utils/HandleLogout.jsx";

function TeacherDashboardHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { to: "/teacher/tuitionpost", icon: <FaChalkboardTeacher className="mr-2" />, text: "Post Tuition" },
    { to: "/teacher/tuitionsearch", icon: <FaSearch className="mr-2" />, text: "Find Tuitions" },
    { to: "/user/posts", icon: <FaBook className="mr-2" />, text: "Your Posts" },
    { to: "/user/batches", icon: <FaUsers className="mr-2" />, text: "Your Batches" }
  ];

  async function getNotificationCount() {
    try {
      const response = await axios.get("/api/v1/notifications/getnotifications", {
        headers: {
          withCredentials: true,
        }
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
          <div className="flex items-center">
            <Link to="/teacher/dashboard" className="flex items-center">
              <span className="text-indigo-600 text-2xl font-bold">Solve</span>
              <span className="text-gray-800 text-2xl font-bold">Space</span>
            </Link>
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default TeacherDashboardHeader;