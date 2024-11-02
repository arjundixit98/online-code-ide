import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

function Login() {
  const { login, isLoggedIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/editor");
  }, [isLoggedIn, navigate]);

  const onLoginClicked = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
    };

    try {
      const response = await login(payload);
      const { message, status } = response.data;
      setStatus(status);
      setMessage(message);
      navigate("/editor");
    } catch (error) {
      console.log(error);
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
