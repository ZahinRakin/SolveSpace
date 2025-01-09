import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function LandingPage() {
  return (
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
  );
}
