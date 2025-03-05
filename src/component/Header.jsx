import React from "react";
import { Link } from "react-router-dom";
import logo from '/just-logo.png';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo and Website Name */}
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

        {/* Right: Login Button */}
        <div>
          <Link
            to="/login"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl 
            transition duration-300 ease-in-out 
            hover:bg-indigo-700 hover:shadow-lg 
            transform hover:-translate-y-1 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}