import React, { useState, useEffect } from "react";
import TeacherDashboardHeader from "./TeacherDashBoardHeader";
import axios from "axios";

function TeacherDashboard() {
const [batchDetails, setBatchDetails] = useState([
  {
    subject: "Physics",
    time: "10:00 AM",
    date: ["Saturday", "Monday", "Wednesday"],
    sessionType: "batch",
    duration: 180, // number of days
  },
  {
    subject: "Math",
    time: "5:00 PM",
    date: ["Sunday", "Tuesday", "Thursday"],
    sessionType: "batch",
    duration: 360, // number of days
  },
]);

const [oneToOneDetails, setOneToOneDetails] = useState([
  {
    studentName: "Zahin",
    subject: "Math",
    date: ["Sunday", "Tuesday", "Thursday"],
    sessionType: "one-to-one",
    duration: 1, // number of days
  },
  {
    studentName: "Rakin",
    subject: "Physics",
    date: ["Monday", "Wednesday", "Friday"],
    sessionType: "one-to-one",
    duration: 10, // number of days
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

  const getBatches = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/teacher/batch", {
        headers: { authentication: `Bearer ${accessToken}` },
      });
      setBatchDetails(response.data.batches);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          getBatches(); // Retry after refreshing the token
        }
      } else {
        console.error("Error fetching batch details:", error);
      }
    }
  };

  const getOneToOnes = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/teacher/one-to-one", {
        headers: { authentication: `Bearer ${accessToken}` },
      });
      setOneToOneDetails(response.data.oneToOneSessions);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          getOneToOnes(); // Retry after refreshing the token
        }
      } else {
        console.error("Error fetching one-to-one details:", error);
      }
    }
  };

  useEffect(() => { //after the api is done this will be uncommented.
    // getBatches();
    // getOneToOnes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <TeacherDashboardHeader />

      {/* Tuition Post Section */}
      <section className="max-w-6xl mx-auto py-6 space-y-6">
        {/* Batches */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Batches</h2>
          <ul className="space-y-4">
            {batchDetails.map((batch, index) => (
              <li key={index} className="bg-white p-4 rounded-md shadow-md">
                <p>
                  <strong>Subject:</strong> {batch.subject}
                </p>
                <p>
                  <strong>Time:</strong> {batch.time}
                </p>
                <p>
                  <strong>Days:</strong> {batch.date.join(", ")}
                </p>
                <p>
                  <strong>Duration:</strong> {batch.duration} days
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* One-to-One Sessions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">One-to-One Sessions</h2>
          <ul className="space-y-4">
            {oneToOneDetails.map((session, index) => (
              <li key={index} className="bg-white p-4 rounded-md shadow-md">
                <p>
                  <strong>Student:</strong> {session.studentName}
                </p>
                <p>
                  <strong>Subject:</strong> {session.subject}
                </p>
                <p>
                  <strong>Days:</strong> {session.date.join(", ")}
                </p>
                <p>
                  <strong>Duration:</strong> {session.duration} day(s)
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
