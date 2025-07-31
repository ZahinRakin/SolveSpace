import axios from "axios";

async function handleJoin(post_id, role, setIsLoading, setError, fetchingMethod) {
  try {
    setIsLoading(true);
    await axios.post(`/api/v1/post/${role}/apply/${post_id}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    await fetchingMethod();
  } catch (error) {
    console.error(`Error Joining the batch:`, error);
    setError("Failed to Join the batch");
  } finally {
    setIsLoading(false);
  }
}

async function handleLeave(post_id, role, setIsLoading, setError, fetchingMethod) {
  try {
    setIsLoading(true);
    await axios.delete(`/api/v1/post/${role}/retract/${post_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    await fetchingMethod();
  } catch (error) {
    console.error(`Error Leaving the batch:`, error);
    setError("Failed to Leave the batch");
  } finally {
    setIsLoading(false);
  }
}

export { handleJoin, handleLeave };
