import React from "react";
import logo from "/just-logo.png";
import facebook from "/facebook.png";
import tweeter from "/tweeter.png";
import instagram from "/instagram.png";

function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 py-12">
      {/* Contact Us Section */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 inline-block px-8 py-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
          <a
            href="mailto:rsrsrsrakin87@gmail.com"
            className="text-white font-bold text-lg tracking-wide"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 grid grid-cols-3 gap-8 items-center">
        {/* Left Side - Logo and Name */}
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="SolveSpace Logo" 
            className="h-12 w-12 transition-transform duration-300 hover:rotate-6" 
          />
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            SolveSpace
          </span>
        </div>

        {/* Middle - Address */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Our Location</h4>
          <p className="text-gray-600 leading-relaxed">
            Institute of Information Technology,<br />
            University of Dhaka,<br />
            Dhaka-1200, Bangladesh
          </p>
        </div>

        {/* Right Side - Follow Us */}
        <div className="text-right">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Follow Us</h4>
          <div className="flex justify-end space-x-6">
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-all duration-300 transform hover:scale-110 hover:rotate-6"
            >
              <img 
                src={facebook} 
                alt="Facebook" 
                className="h-8 w-8 opacity-80 hover:opacity-100" 
              />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-all duration-300 transform hover:scale-110 hover:rotate-6"
            >
              <img 
                src={tweeter} 
                alt="Twitter" 
                className="h-8 w-8 opacity-80 hover:opacity-100" 
              />
            </a>
            <a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-all duration-300 transform hover:scale-110 hover:rotate-6"
            >
              <img 
                src={instagram} 
                alt="Instagram" 
                className="h-8 w-8 opacity-80 hover:opacity-100" 
              />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} SolveSpace. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;