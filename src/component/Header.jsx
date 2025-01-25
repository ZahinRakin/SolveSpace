import React from "react";
import { Link } from "react-router-dom";
import logo from '/just-logo.png'; 

export default function Header() {
  return (
    <header className="flex items-center justify-between px-16 pt-14 bg-gray-100">
      {/* Left: Logo and Website Name */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">SolveSpace</h1>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="flex justify-center space-x-8 flex-grow">
        <Link to="/" className="text-xl text-gray-600 hover:text-indigo-600">
          Home
        </Link>
        <Link to="about" className="text-xl text-gray-600 hover:text-indigo-600">
          About Us
        </Link>
      </nav>

      {/* Right: Login Button */}
      <div>
        <Link
          to="/login"
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
