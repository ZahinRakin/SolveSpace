import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function AboutUs() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 
        text-white bg-indigo-600/70 hover:bg-indigo-700/80 
        px-4 py-2 rounded-lg transition duration-300 
        hover:scale-105 hover:shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-50"
        style={{ backgroundImage: 'url(../../public/images/website-back-img.jpg)' }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-extrabold text-white mb-10 drop-shadow-lg">
            About SolveSpace
          </h1>

          <div className="bg-white/90 rounded-xl shadow-2xl p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-800 leading-relaxed mb-8">
              SolveSpace is an innovative platform dedicated to bridging the gap between students and teachers. 
              Our mission is to create a seamless, intuitive learning environment that empowers educational connections.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                  Seamless Connectivity
                </h3>
                <p className="text-gray-700">
                  We provide intuitive tools that make communication between students and teachers effortless.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">
                  Collaborative Learning
                </h3>
                <p className="text-gray-700">
                  Our platform encourages active engagement and collaborative educational experiences.
                </p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-teal-800 mb-4">
                  Continuous Growth
                </h3>
                <p className="text-gray-700">
                  We are committed to supporting the continuous learning and development of both students and educators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;