import axios from 'axios';

async function getUser(setUser) {
  try {
    const response = await axios.get("/api/v1/users/viewprofile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    setUser(response.data.data); // Store data in state
    console.log("studentposts: user: ", response.data.data); // Debug log
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

export default getUser;