import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    const accessToken = localStorage.getItem('accessToken');
    axios.post('/api/v1/users/logout', {accessToken})
      .then(response => {
        if(response.status === 200){
          console.log("user have logged out!");
          navigate("/");
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <button onClick={handleLogout}>
      logout
    </button>
  );
}

export default Logout
