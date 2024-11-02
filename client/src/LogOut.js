import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

function LogOut() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const logMeOut = async () => {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    logMeOut();
  });
}

export default LogOut;
