import React from "react";

function AboutUs() {
  return (
    <div 
      className="relative min-h-[70rem] bg-cover bg-center flex items-center justify-center" 
      style={{ backgroundImage: 'url(../../public/images/website-back-img.jpg)' }} 
    >
      {/* Content */}
      <div className="relative z-10 text-center p-8">
        <div className="bg-opacity-75 p-8 rounded-lg">
          <h2 className="text-6xl font-bold text-black mb-4">About SolveSpace</h2>
          <p className="text-xl text-gray-600">
            Hello, this is SolveSpace. <br/>We're dedicated to connecting students and teachers<br/>
            to create a seamless learning environment. <br/>Unfortunately, we don't have a lot
            of details about us, <br/>but we're here to help you learn and grow!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
