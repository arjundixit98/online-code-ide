import { jwtDecode } from "jwt-decode";

export const checkAuthStatus = () => {
  try {
    // Get the token from cookies
    const tokenRow = document.cookie
      ?.split("; ")
      .find((row) => row.startsWith("token="));

    if (!tokenRow) {
      throw new Error("Token not found in cookies");
    }

    const token = tokenRow.split("=")[1];
    const decoded = jwtDecode(token); // Decode the token

    console.log("Decoded token:", decoded);
    return true; // Token is valid
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return false; // Token is invalid or not present
  }
};
