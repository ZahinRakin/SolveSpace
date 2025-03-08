import React, { useState } from 'react';
import axios from 'axios';

function ReportModal({ teacherId }) {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportText.trim()) {
      setError("Please provide details for your report");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/v1/report/create', {
          reportee_id: teacherId,
          message: reportText
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        });

      
      setSubmitSuccess(true);
      setReportText("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Report Teacher</h3>
      
      {submitSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your report has been submitted successfully. Our team will review it shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="reportText" className="block text-gray-700 mb-2">
              Report Details
            </label>
            <textarea
              id="reportText"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Please provide details about your concern..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReportModal;
