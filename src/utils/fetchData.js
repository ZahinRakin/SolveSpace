import axios from 'axios';

const fetchData = async (path, redirectLink, setData, setIsLoading, setError, navigate) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setData(response.data.data);
  } catch (error) {
    if (error.message === "Unauthorized user" || error.response?.status === 401) {
      try {
        const response = await axios.post("/api/v1/refresh-accesstoken", {}, {
          withCredentials: true,
        });
        const accessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        
        const retryResponse = await axios.get(`${path}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(retryResponse.data.data);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        setError("Session expired. Please log in again.");
        navigate(`${redirectLink}`);
      }
    } else {
      setError("Failed to load posts. Please try again later.");
    }
  } finally {
    setIsLoading(false);
  }
};

export default fetchData;
