import axios from "axios";

function handleLogout(navigate) {
  const accessToken = localStorage.getItem('accessToken');
  axios.post('/api/v1/logout', { accessToken })
    .then(response => {
      if (response.status === 200) {
        console.log("User has logged out!");
        navigate("/");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

export default handleLogout;