import React from "react";

function AboutUs() {
  // Team member data with image links
  const teamMembers = [
    {
      name: "Mainul Hossain",
      role: "Founder & CEO",
      description: "Former educator with a passion for technology and accessible learning.",
      imageSrc: "/images/mainul1.jpg" // Path to teacher's image
    },
    {
      name: "Jane Smith",
      role: "Lead Developer",
      description: "Expert in educational technology with over 10 years of experience.",
      imageSrc: "/images/shakib1.jpg" // Path to teacher's image
    },
    {
      name: "Alex Johnson",
      role: "Education Specialist",
      description: "Former teacher with expertise in curriculum development and learning strategies.",
      imageSrc: "/images/Rakin.jpg" // Path to teacher's image
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Clearer Background Image */}
      <section 
        className="relative py-32 bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: 'url("/images/website-back-img.jpg")' }} 
      >
        {/* Reduced opacity and changed gradient for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-purple-900 opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            About <span className="text-purple-300">SolveSpace</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            We're dedicated to connecting students and teachers
            to create a seamless learning environment.
          </p>
        </div>
      </section>

      {/* Mission Section with Card Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 relative">
                <span className="inline-block relative">
                  Our Mission
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-indigo-500 rounded-full"></div>
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-5 leading-relaxed">
                At SolveSpace, we believe that education should be accessible, engaging, and effective for everyone. 
              </p>
              <p className="text-lg text-gray-700 mb-5 leading-relaxed">
                Our mission is to build bridges between students and educators through innovative technology solutions that enhance the learning experience.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We strive to create tools that simplify administrative tasks, foster collaboration, and promote a more interactive educational environment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 text-white shadow-xl transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-semibold mb-8">Our Values</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Innovation in education technology</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Accessibility for all learners</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Collaboration between students and teachers</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Continuous improvement and learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Image Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            We're a dedicated group of educators and technologists passionate about improving education.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-3 transition duration-300 border border-gray-100">
                {/* Profile Image */}
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.imageSrc} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <a href="#" className="text-indigo-500 hover:text-indigo-700">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-700 hover:text-blue-900">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-indigo-700">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Educational Revolution</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Ready to transform the way you teach or learn? SolveSpace provides the tools you need to succeed.
          </p>
          <a href="#" className="inline-block bg-white text-indigo-700 font-medium py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 text-lg">
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;