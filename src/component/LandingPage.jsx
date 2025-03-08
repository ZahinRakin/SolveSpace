import React from "react";
import { Link } from "react-router-dom";
import laptopImage from '/images/website-back-img.jpg';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-20 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-white text-2xl font-bold">
              <Link to="/">SolveSpace</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${laptopImage})` }} 
        ></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left">
          <div className="md:max-w-2xl lg:max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-indigo-300">SolveSpace</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10">
              SolveSpace connects students and teachers to create a seamless
              learning environment. Join us to explore scheduling, batch
              management, and much more.
            </p>
            <div className="space-x-4">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-300 inline-block">
                <Link to="/login">Get Started</Link>
              </button>
              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transform hover:-translate-y-1 transition duration-300 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SolveSpace?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers innovative solutions for educational institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Scheduling</h3>
              <p className="text-gray-600">
                Schedule classes, meetings, and events with our intuitive interface.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Batch Management</h3>
              <p className="text-gray-600">
                Organize students into batches for efficient course management.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Resource Sharing</h3>
              <p className="text-gray-600">
                Share materials, assignments, and feedback all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to transform your educational experience?</h2>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 shadow-lg transform hover:-translate-y-1 transition duration-300 inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}