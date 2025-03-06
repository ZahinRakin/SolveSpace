import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiTrash2, FiArrowLeft } from "react-icons/fi";
import TeacherDashboardHeader from "./teacher/TeacherDashBoardHeader";

function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async (accessToken) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sub-Header with Back Button */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              <FiArrowLeft className="inline mr-2" /> Back
            </button>
            <h1 className="text-2xl font-bold ml-4 text-gray-800">Notifications</h1>
          </div>
          <div className="flex items-center">
            <FiBell className="text-indigo-600 h-5 w-5" />
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          </div>
        </header>

        {/* Notifications List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors ${
                    notification.isViewed ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-gray-800">{notification.title}</h2>
                      {!notification.isViewed && (
                        <span className="ml-2 inline-block w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 px-4 text-center">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <FiBell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;