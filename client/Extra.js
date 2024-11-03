//Check if the user is already logged in
// const checkIfLoggedIn = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/auth/verify", {
//       withCredentials: true,
//     });
//     if (response.data.status === "success") {
//       console.log("User authenticated", response.data.username);
//       navigate("/editor");
//     }
//   } catch (error) {
//     console.error("Error occured", error.response?.data?.message);
//   }
// };
// useEffect(() => checkIfLoggedIn, [navigate]);

import "./Signup.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        payload
      );
      console.log(response.data);
      const { status, message } = response.data;
      setStatus(status);
      setMessage(message);

      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Error received while signing up", error);

        setStatus(error.response.data.status);
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div className="signup">
        <label htmlFor="username">UserName</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Register</button>
        <div>
          {message && (
            <p>
              {" "}
              {status} : {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
