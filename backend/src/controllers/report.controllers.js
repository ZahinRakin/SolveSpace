import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Report from "../models/Report.models.js";
import Admin from "../models/admin.models.js";
import User from "../models/users.models.js";


const getYourReports = asyncHandler(async (req, res) => {
  try {
    const { _id: user_id } = req.user;

    const reports = await Report.find({ reporter_id: user_id })
      .select("message createdAt reportee_id")
      .sort({ createdAt: -1 });

    if (!reports.length) {
      return res.status(404).json(new ApiResponse(404, [], "No reports found"));
    }

    return res.status(200).json(new ApiResponse(200, reports, "Reports retrieved successfully"));
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

const createReport = asyncHandler(async (req, res) => {
  const {
    user: { _id: reporter_id, role: reporter_role },
    body: { reportee_id, message }
  } = req;

  console.log("Received report data:", { reportee_id, message, reporter_id });

  try {
    if (!reportee_id || !message || !reportee_id.trim() || !message.trim()) {
      console.log("Validation failed: Empty reportee_id or message");
      return res.status(400).json(new ApiResponse(400, null, "You cannot keep username or message empty."));
    }

    const reportee = await User.findById(reportee_id).select("role");
    if (!reportee) {
      console.log(`User with id ${reportee_id} not found`);
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    if (reportee.role === "admin") {
      console.log(`Attempted report on admin with id ${reportee_id}`);
      return res.status(400).json(new ApiResponse(400, null, "You cannot report the admin."));
    }

    const report = await Report.create({
      reporter_id,
      reportee_id,
      message
    });

    console.log("Report created successfully:", report);

    const admin = await Admin.findOne({});
    if (!admin) {
      console.log("Admin not found, cannot link report.");
      return res.status(500).json(new ApiResponse(500, null, "Admin not found"));
    }

    admin.reports.push(report._id);
    await admin.save();
    console.log("Admin reports updated successfully");

    return res.status(200).json(new ApiResponse(200, report, "Your report has been submitted"));
  } catch (error) {
    console.error("Error in creating report:", error);
    return res.status(500).json(new ApiResponse(500, null, "An unexpected error occurred"));
  }
});


const deleteReport = asyncHandler(async (req, res) => {
  const {
    user: { _id: user_id, role },
    params: { id: report_id }
  } = req;

  const report = await Report.findById(report_id);
  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  if (!report.reporter_id.equals(user_id) && role !== "admin") {
    return res.status(403).json(new ApiResponse(403, null, "You don't have permission to delete this."));
  }

  await Report.deleteOne({ _id: report_id });

  return res.status(200).json(new ApiResponse(200, null, "Report deleted successfully"));
});

const updateReport = asyncHandler(async (req, res) => {
  const { id: report_id } = req.params;
  const { message } = req.body;

  if (!message.trim()) {
    return res.status(400).json(new ApiResponse(400, null, "Message cannot be empty."));
  }

  const report = await Report.findById(report_id);
  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  report.message = message;
  await report.save();

  return res.status(200).json(new ApiResponse(200, report, "Report updated successfully"));
});

export {
  createReport,
  updateReport,
  deleteReport,
  getYourReports
}