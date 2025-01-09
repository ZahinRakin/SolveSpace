import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SolveSpace</h1>
          <nav>
            <Link to="/login" className="px-4 py-2 rounded hover:bg-indigo-700">
              Log In
            </Link>
            <Link
              to="/signup"
              className="ml-4 px-4 py-2 bg-white text-indigo-600 rounded hover:bg-gray-200"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 SolveSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
