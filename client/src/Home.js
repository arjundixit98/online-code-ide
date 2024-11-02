import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProblem from "./AddProblem";
import ViewProblems from "./ViewProblems";
import LoadProblem from "./LoadProblem";
import "./stylesheets/home.css";
import DefaultEditor from "./DefaultEditor";
import SignUp from "./Signup";
import Login from "./Login";
import LogOut from "./LogOut";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "./AuthContext";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Router>
      <div className="nav-bar">
        <Link className="nav-links" to={"/"}>
          Home
        </Link>
        <Link className="nav-links" to={"/view-problem-set"}>
          Problem Set
        </Link>
        <Link className="nav-links" to={"/add-problem"}>
          Add Problem
        </Link>
        {isLoggedIn && (
          <Link className="nav-links" to={"/logout"}>
            LogOut
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <DefaultEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-problem-set"
          element={
            <ProtectedRoute>
              <ViewProblems />
            </ProtectedRoute>
          }
        />
        <Route path="/load-problem/:id" element={<LoadProblem />} />
        <Route
          path="/add-problem"
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </Router>
  );
}

export default Home;
