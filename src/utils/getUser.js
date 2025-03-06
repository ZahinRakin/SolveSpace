import axios from 'axios';

async function getUser(setUser) {
  try {
    const response = await axios.get("/api/v1/users/viewprofile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    setUser(prevUser => response.data.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}


export default getUser;