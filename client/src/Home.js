import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProblem from "./AddProblem";
import ViewProblems from "./ViewProblems";
import LoadProblem from "./LoadProblem";
import "./stylesheets/home.css";
import DefaultEditor from "./DefaultEditor";
import SignUp from "./Signup";
import Login from "./Login";
import LogOut from "./LogOut";
import { AuthContext } from "./AuthContext";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  // useEffect(() => {
  //   console.log(isLoggedIn);
  // });

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
        <Route path="/editor" element={<DefaultEditor />} />
        <Route path="/view-problem-set" element={<ViewProblems />} />
        <Route path="/load-problem/:id" element={<LoadProblem />} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </Router>
  );
}

export default Home;
