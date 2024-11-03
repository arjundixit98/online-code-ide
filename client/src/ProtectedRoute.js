import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  // If the user is not logged in, navigate to the login page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the child component (XYZ page in this case)
  return children;
}

export default ProtectedRoute;
