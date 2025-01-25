import React from "react";
import { Outlet, Link } from "react-router-dom";
import laptopImage from '../../public/images/website-back-img.jpg'; // Import the image

export default function LandingPage() {
  return (
    <main 
      className="flex-grow mx-auto px-0 py-16 text-center relative" 
      style={{ height: '70rem', width: '100%' }}
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${laptopImage})`, height: '100%', width: '100%' }} 
      ></div>

      {/* Content container with Flexbox */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to SolveSpace
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          SolveSpace connects students and teachers to create a seamless
          learning environment. Join us to explore scheduling, batch
          management, and much more.
        </p>

        <div>
          <Link
            to="/login"
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
