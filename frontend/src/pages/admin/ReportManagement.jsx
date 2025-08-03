import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboardHeader from "./AdminDashboardHeader.jsx";

function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/admin/get-all-reports", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReports(response.data.data);
    } catch (error) {
      if (error.message === "Unauthorized user" || error.response?.status === 401) {
        try {
          const response = await axios.post("/api/v1/refresh-accesstoken", {}, {
            withCredentials: true,
          });
          const accessToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", accessToken);
          const retryResponse = await axios.get("/api/v1/admin/get-all-reports", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setReports(retryResponse.data.data);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          setError("Session expired. Please log in again.");
          navigate("/admin/reports");
        }
      } else {
        setError("Failed to load reports.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function resolveReport(reportId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/report/delete/${reportId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReports(reports.filter(report => report._id !== reportId));
    } catch (error) {
      console.error("Failed to resolve report", error);
      setError("Failed to resolve the report.");
    }
  }

  async function kickReportee(reporteeId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/api/v1/admin/remove-user/${reporteeId}`, { //removed extra {} body
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReports(reports.filter(report => report.reportee_id._id !== reporteeId));
    } catch (error) {
      console.error("Failed to kick reportee", error);
      setError("Failed to kick the reportee.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentDashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Report Management</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading reports...
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600">
              {error}
            </div>
          ) : (
            <div>
              {reports.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No reports found.
                </div>
              ) : (
                <div>
                  {reports.map((report) => (
                    <div 
                      key={report._id} 
                      className="px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >  {/**bro you didn't mention who has been reported. if you don't mention how the user will know who has been reported. */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Reported by: <span className="text-gray-900">{report.reporter_id.username}</span>
                          </p>
                          <p className="text-sm font-medium text-gray-600">
                            Reported user: <span className="text-gray-900">{report.reportee_id.username}</span>
                          </p>
                          <p className="mt-2 text-gray-700">{report.message}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => resolveReport(report._id)}
                            className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => kickReportee(report.reportee_id._id)}
                            className="px-3 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                          >
                            Kick Reportee
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportManagement;