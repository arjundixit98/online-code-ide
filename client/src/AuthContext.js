import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  useEffect(() => {
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
    checkIfLoggedIn();
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logoutt = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logoutt }}>
      {children}
    </AuthContext.Provider>
  );
};
