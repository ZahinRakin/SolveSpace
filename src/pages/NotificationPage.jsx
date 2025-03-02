import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async (accessToken) => {
    try {
      const response = await axios.get("/api/v1/notifications/getnotifications", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const formattedNotifications = response.data.data.map((notification) => ({
        id: notification._id, // Store notification ID for deletion
        title: "New Message",
        body: notification.message,
        time: new Date(notification.createdAt).toLocaleString(),
        isViewed: notification.isRead,
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleRefreshToken();
      } else {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.delete("/api/v1/notifications/delete-path", {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { notificationId }, // Sending the notification ID in the request body
      });

      if (response.status === 200) {
        setNotifications(notifications.filter((n) => n.id !== notificationId)); // Remove from UI
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Refresh access token if needed
  const handleRefreshToken = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/v1/refresh-accesstoken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newAccessToken = response.data.newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
      await fetchNotifications(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate('/login');
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchNotifications(accessToken);
    } else {
      console.error("No access token found. Redirecting to login...");
      navigate('/login');
    }
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
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded shadow-md flex justify-between items-center ${
                notification.isViewed ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>
                <h2 className="text-lg font-bold">{notification.title}</h2>
                <p className="text-sm text-gray-600">{notification.body}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
              <button
                onClick={() => deleteNotification(notification.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No notifications found.</p>
        )}
      </ul>
    </div>
  );
}

export default NotificationPage;
