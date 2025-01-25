import React from "react";
import logo from "/just-logo.png";
import facebook from "/facebook.png";
import tweeter from "/tweeter.png";
import instagram from "/instagram.png";

function Footer() {
  return (
    <footer className="bg-white text-black pt-8 pb-4">
      {/* Top Section */}
      <div className="text-center mb-8">
        <a 
          href="mailto:rsrsrsrakin87@gmail.com"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Contact Us
        </a>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center max-w-7xl mx-auto pb-12">
        {/* Left Side - Logo and Name */}
        <div className="flex items-center space-x-2 ml-8"> {/* Left margin of 30px */}
          <img src={logo} alt="Logo" className="h-8" />
          <span className="font-bold text-xl">SolveSpace</span>
        </div>

        {/* Middle - Address */}
        <div className="text-center">
          <p className="text-sm">
            Institute of Information Technology,<br />
            University of Dhaka,<br />
            Dhaka-1200, Bangladesh
          </p>
        </div>

        {/* Right Side - Follow Us */}
        <div className="text-center mr-8"> {/* Right margin of 30px */}
          <p className="font-semibold text-lg mb-2">Follow Us</p>
          <div className="flex justify-center space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="h-6 hover:opacity-75" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={tweeter} alt="Twitter" className="h-6 hover:opacity-75" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" className="h-6 hover:opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
