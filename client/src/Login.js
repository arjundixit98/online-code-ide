import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function Login() {
  const { login, isLoggedIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isLoggedIn) navigate("/editor");
  });

  const onLoginClicked = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        payload,
        { withCredentials: true }
      );
      const { message, status } = response.data;
      setStatus(status);
      setMessage(message);
      login();
      navigate("/editor");
    } catch (error) {
      if (error.response) {
        console.error("Error received while logging in", error);

        setStatus(error.response.data.status);
        setMessage(error.response.data.message);
      }
    }
  };
  return (
    <div>
      <div className="login">
        <label htmlFor="username">UserName</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={onLoginClicked}>Login</button>
        <Link to="/signup">Register here</Link>
        <div>
          {message && (
            <p>
              {status} : {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
