import { jwtDecode } from "jwt-decode";

export const checkAuthStatus = () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token"))
      .split("=")[1];

    const decoded = jwtDecode(token);
    return true;
    //console.log(decoded);
  } catch (error) {
    console.error("Error decoding token :", error);
    return false;
  }
};
