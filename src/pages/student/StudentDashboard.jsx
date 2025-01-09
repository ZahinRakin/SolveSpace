import React, { useState } from "react";

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [requirements, setRequirements] = useState("");
  const [batches, setBatches] = useState([
    { id: 1, name: "Mathematics - Batch A", teacher: "Mr. John Doe" },
    { id: 2, name: "Physics - Batch B", teacher: "Dr. Jane Smith" },
  ]);
  const [privateTutors, setPrivateTutors] = useState([
    { id: 1, name: "Mr. Alan Watts" },
    { id: 2, name: "Ms. Sarah Connor" },
  ]);

  const [profile, setProfile] = useState({
    name: "John Student",
    email: "john@student.com",
    phone: "123-456-7890",
    subjects: ["Math", "Physics"],
  });

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Add logic for searching teachers or subjects
  };

  const handlePostRequirement = () => {
    console.log("Posting requirement:", requirements);
    // Add logic for posting requirements
  };

  const handleProfileUpdate = () => {
    console.log("Updating profile:", profile);
    // Add logic for updating profile
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Dashboard Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <button
            onClick={() => console.log("Logging out...")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
          <ul className="mt-3 space-y-2">
            <li className="p-3 bg-gray-50 rounded-md shadow-md">
              <span className="font-medium">New Application:</span> Mr. Alan
              Watts has applied for your Math requirement.
            </li>
            <li className="p-3 bg-gray-50 rounded-md shadow-md">
              <span className="font-medium">Batch Update:</span> Physics - Batch
              B has a new schedule update.
            </li>
            <li className="p-3 bg-gray-50 rounded-md shadow-md">
              <span className="font-medium">Reminder:</span> Complete your
              profile to get more personalized recommendations.
            </li>
          </ul>
        </section>

        {/* Profile Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">Your Profile</h2>
          <div className="mt-3 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subjects"
                className="block text-sm font-medium text-gray-700"
              >
                Subjects
              </label>
              <input
                type="text"
                id="subjects"
                value={profile.subjects.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    subjects: e.target.value.split(", "),
                  })
                }
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* Search Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">Search</h2>
          <div className="mt-3 flex space-x-4">
            <input
              type="text"
              placeholder="Search for subjects or teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md shadow-sm"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Search
            </button>
          </div>
        </section>

        {/* Post Requirement Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">
            Post Requirement
          </h2>
          <div className="mt-3 space-y-4">
            <textarea
              placeholder="Describe your requirement..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
            ></textarea>
            <button
              onClick={handlePostRequirement}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Post
            </button>
          </div>
        </section>

        {/* Batches Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">Your Batches</h2>
          <ul className="mt-3 space-y-2">
            {batches.map((batch) => (
              <li
                key={batch.id}
                className="p-3 bg-gray-50 rounded-md shadow-md"
              >
                <strong>{batch.name}</strong> (Teacher: {batch.teacher})
              </li>
            ))}
          </ul>
        </section>

        {/* Private Tutors Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">
            Your Private Tutors
          </h2>
          <ul className="mt-3 space-y-2">
            {privateTutors.map((tutor) => (
              <li
                key={tutor.id}
                className="p-3 bg-gray-50 rounded-md shadow-md"
              >
                {tutor.name}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
