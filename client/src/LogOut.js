import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function LogOut() {
  const { logoutt } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/logout`
        );
        if (response.data.status === "success") {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          console.log("Logged out sucessfully");
          logoutt();
          navigate("/");
        }
      } catch (error) {
        console.error("Error occured", error.response?.data?.message);
      }
    };
    logout();
  });
}

export default LogOut;
