import React from "react";
import { Link } from "react-router-dom";
import laptopImage from '/images/website-back-img.jpg';

export default function LandingPage() {
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-50"
        style={{ 
          backgroundImage: `url(${laptopImage})`, 
          backgroundSize: 'cover',
          zIndex: 1
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to SolveSpace
        </h1>
        
        <p className="text-xl text-white mb-10 max-w-3xl leading-relaxed font-medium opacity-90 drop-shadow-md">
          SolveSpace is a comprehensive platform that bridges the gap between students and teachers, 
          creating an innovative and seamless learning environment. Streamline scheduling, 
          manage batches, and unlock your educational potential.
        </p>

        <div className="flex space-x-6">
          <Link
            to="/signup"
            className="px-10 py-4 bg-indigo-600 text-white font-semibold rounded-xl 
            hover:bg-indigo-700 transition duration-300 ease-in-out 
            transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl 
            hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out 
            transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}