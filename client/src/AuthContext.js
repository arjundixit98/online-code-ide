import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        payload,
        { withCredentials: true }
      );
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      if (error) {
        // console.error("Error received while logging in", error);
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        {},
        { withCredentials: true } // Send cookies with the request
      );
      setIsLoggedIn(false); // Update local state to reflect logout
    } catch (error) {
      throw error;
      // You might want to handle logout errors differently, like showing a message
    }
  };

  const checkIfLoggedIn = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/verify`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        // console.log("User authenticated", response.data.username);
        setIsLoggedIn(true);
      }
    } catch (error) {
      // console.error("Error occured", error.response?.data?.message);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
