import axios from "axios";

async function handleJoin(post_id, setIsLoading, setError, fetchingMethod){
  try {
    setIsLoading(true);
    await applyToJoin(post_id);
    await fetchingMethod();
  } catch (error) {
    console.error("Error Joining the batch: ", error);
    setError("Failed to Join the batch");
  } finally {
    setIsLoading(false);
  }
}

async function applyToJoin(post_id){
  await axios.post(`/api/v1/post/student/apply/${post_id}`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
}


async function handleLeave(post_id, setIsLoading, setError, fetchingMethod){
  try {
    setIsLoading(true);
    await applyToExit(post_id);
    await fetchingMethod();
  } catch (error) {
    console.error("Error Leaving the batch: ", error);
    setError("Failed to Leave the batch");
  } finally {
    setIsLoading(false);
  }
}
async function applyToExit(post_id){
  await axios.delete(`/api/v1/post/student/retract/${post_id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
}

export { handleJoin, handleLeave};