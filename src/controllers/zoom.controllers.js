import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "./notification.controllers.js";
import Batch from "../models/batch.models.js";
import axios from "axios";

const createMeeting = asyncHandler(async (req, res) => {
  try {
    const accessToken = await getZoomAccessToken();

    const {batch_id} = req.params;
    const { _id: user_id, username } = req.user;

    const batch = await Batch.findById(batch_id);
    const {
      subject,
      student_ids
    } = batch;
    

    const response = await axios.post(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`,
      {
        topic: `${subject} by ${username}`,
        type: 2, // Scheduled meeting
        start_time: new Date().toISOString(), // Format: YYYY-MM-DDTHH:mm:ssZ (ISO 8601)
        duration: 30, // Default: 30 minutes
        timezone: "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          approval_type: 0,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", //here why the Content-Type has double quotation?
        },
      }
    );

    const meetingData = response.data;

    for(const sid of student_ids){
      await sendNotification(sid, user_id, `${username} teacher has started class. join here:\n${meetingData.join_url}`);
    }
    

    res
    .status(200)
    .json(new ApiResponse(200,{
      meetingId: meetingData.id,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url,
      topic: meetingData.topic,
      startTime: meetingData.start_time,
    }, "success"));
  } catch (error) {
    console.error("Error creating Zoom meeting:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

async function getZoomAccessToken() {
  const tokenUrl = "https://zoom.us/oauth/token";
  const auth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      tokenUrl,
      `grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`, // Fixed form data string
      {
        headers: {
          Authorization: `Basic ${auth}`, // Fixed template literal
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Zoom access token:", error.response?.data || error.message);
    throw error;
  }
}

export {
  createMeeting,
};
