import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function LandingPage() {
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to SolveSpace
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          SolveSpace connects students and teachers to create a seamless
          learning environment. Join us to explore scheduling, batch
          management, and much more.
        </p>
        <div>
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Outlet for Child Routes */}
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
