import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDashboardHeader from "./StudentDashboardHeader"

function StudentDashboard() {
  const [availableTuition, setAvailableTuition] = useState([
    {
      teacherName: "Mr. X",
      subject: "Physics",
      time: "10:00 AM",
      date: ["Monday", "Wednesday", "Friday"],
      perClassPay: 300,
    },
    {
      teacherName: "Mr. Y",
      subject: "Math",
      time: "5:00 PM",
      date: ["Tuesday", "Thursday", "Saturday"],
      perClassPay: 400,
    },
  ]);

  const [myClasses, setMyClasses] = useState([
    {
      teacherName: "Mr. hashem",
      subject: "Chemistry",
      time: "4:00 PM",
      date: ["Monday", "Wednesday"],
      duration: 90, // number of days
    },
    {
      teacherName: "Mr. kashem",
      subject: "Biology",
      time: "2:00 PM",
      date: ["Tuesday", "Thursday"],
      duration: 60, // number of days
    },
  ]);

  const handleTokenRefresh = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { authentication: `Bearer ${accessToken}` },
      });
      localStorage.setItem("accessToken", response.data.newAccessToken);
      return response.data.newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const fetchAvailableTuition = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/student/available-tuition", {
        headers: { authentication: `Bearer ${accessToken}` },
      });
      setAvailableTuition(response.data.tuitions);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          fetchAvailableTuition(); // Retry after refreshing the token
        }
      } else {
        console.error("Error fetching tuition details:", error);
      }
    }
  };

  const fetchMyClasses = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/student/my-classes", {
        headers: { authentication: `Bearer ${accessToken}` },
      });
      setMyClasses(response.data.classes);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          fetchMyClasses(); // Retry after refreshing the token
        }
      } else {
        console.error("Error fetching classes:", error);
      }
    }
  };

  useEffect(() => {
    // Uncomment after APIs are ready
    // fetchAvailableTuition();
    // fetchMyClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <StudentDashboardHeader/>

      <main className="max-w-6xl mx-auto py-6 space-y-6">
        {/* My Classes Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Classes</h2>
          <ul className="space-y-4">
            {myClasses.map((classItem, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Teacher:</strong> {classItem.teacherName}
                  </p>
                  <p>
                    <strong>Subject:</strong> {classItem.subject}
                  </p>
                  <p>
                    <strong>Time:</strong> {classItem.time}
                  </p>
                  <p>
                    <strong>Days:</strong> {classItem.date.join(", ")}
                  </p>
                  <p>
                    <strong>Duration:</strong> {classItem.duration} days
                  </p>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Drop
                </button>
              </li>
            ))}
          </ul>
        </section>
        {/* Available Tuition Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recommended Teachers
          </h2>
          <ul className="space-y-4">
            {availableTuition.map((tuition, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Teacher:</strong> {tuition.teacherName}
                  </p>
                  <p>
                    <strong>Subject:</strong> {tuition.subject}
                  </p>
                  <p>
                    <strong>Time:</strong> {tuition.time}
                  </p>
                  <p>
                    <strong>Days:</strong> {tuition.date.join(", ")}
                  </p>
                  <p>
                    <strong>Per Class Pay:</strong> ${tuition.perClassPay}
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
