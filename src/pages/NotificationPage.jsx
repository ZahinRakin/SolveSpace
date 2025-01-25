

//this file has handled the refresh access token part as well. although the notifications api isn't built yet. soon it will be done.

import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      title: "first message",
      body: "this is the body",
      time: "10.30",
      isViewed: false,
    },
    {
      title: "second message",
      body: "this is the body",
      time: "11.30",
      isViewed: true,
    },
    {
      title: "third message",
      body: "this is the body",
      time: "12.30",
      isViewed: false,
    },
  ]);

  // Function to fetch notifications
  const fetchNotifications = async (accessToken) => {
    try {
      const response = await axios.get("/api/v1/notification/get-notification", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(response.data.notifications); // Assuming `notifications` is the field in the response
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle token refresh if accessToken is invalid
        await handleRefreshToken();
      } else {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  // Function to refresh accessToken
  const handleRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newAccessToken = response.data.newAccessToken; // Assuming backend returns the new access token
      localStorage.setItem("accessToken", newAccessToken); // Update localStorage
      await fetchNotifications(newAccessToken); // Retry fetching notifications
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate('/login');
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // if (accessToken) {
    //   fetchNotifications(accessToken);
    // } else {
    //   console.error("No access token found. Redirecting to login...");
    //   navigate('/login');
    // }
    console.log(accessToken) //////////////dummy print.
  }, []);

  return (
    <div className="p-4">
      {/* Header with Back Button */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold ml-4">Notifications</h1>
      </header>

      {/* Notifications List */}
      <ul className="space-y-4">
        {notifications.map((notification, index) => (
          <li
            key={index}
            className={`p-4 rounded shadow-md ${
              notification.isViewed ? "bg-gray-100" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-bold">{notification.title}</h2>
            <p className="text-sm text-gray-600">{notification.body}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPage;
