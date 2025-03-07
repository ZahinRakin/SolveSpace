import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "./notification.controllers.js";
import Batch from "../models/batch.models.js";
import axios from "axios";
import { sendEmail } from "./emailService.controllers.js";

const eraseJoinLink = async (batch_id) => {
  setTimeout(async () => {
    try {
      const batch = await Batch.findById(batch_id);
      if (batch) {
        batch.join_class_link = null;
        await batch.save();
        console.log(`Cleared join_class_link for batch: ${batch_id}`);
      }
    } catch (error) {
      console.error(`Failed to clear join_class_link for batch ${batch_id}:`, error.message);
    }
  }, 30 * 60 * 1000); // 30 minutes in milliseconds
};


const createMeeting = asyncHandler(async (req, res) => {
  try {
    const accessToken = await getZoomAccessToken();
    const { batch_id } = req.params;
    const { _id: user_id, username } = req.user;

    const batch = await Batch.findById(batch_id).populate("student_ids", "email");
    if (!batch) {
      return res.status(404).json(new ApiResponse(404, null, "Batch not found."));
    }

    console.log(`Creating Zoom meeting for batch: ${batch_id}, Subject: ${batch.subject}`);

    const { subject, student_ids } = batch;

    const response = await axios.post(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`,
      {
        topic: `${subject} by ${username}`,
        type: 2,
        start_time: new Date().toISOString(),
        duration: 30, 
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
          'Content-Type': 'application/json',
        },
      }
    );

    const meetingData = response.data;
    batch.join_class_link = meetingData.join_url;
    console.log(`Join URL: ${meetingData.join_url}, Host URL: ${meetingData.start_url}`);

    await batch.save();
    eraseJoinLink(batch._id);

    await Promise.all(student_ids.map(async (st) => {
      try {
        await sendNotification(st._id, user_id, `${username} teacher has started class. <a href="${meetingData.join_url}">Join here</a>.`);
        await sendEmail(st.email, `Batch [${batch._id}] is now active. Join`, `<a href=${meetingData.join_url}>Join meeting</a>`);
      } catch (err) {
        console.error(`Failed to notify/email student ${st._id}:`, err.message);
      }
    }));

    res.status(200).json(new ApiResponse(200, {
      meetingId: meetingData.id,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url,
      topic: meetingData.topic,
      startTime: meetingData.start_time,
    }, "Meeting created successfully"));

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
