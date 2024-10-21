import React, { useState, useEffect } from "react";
import { checkAuthStatus } from "./service/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./stylesheets/viewproblems.css";

function ViewProblems() {
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/problems/get-problems`
        );
        setProblemList(data);
        setLoading(false);
      } catch (error) {
        console.log("Error occurred", error);
        setLoading(false);
      }
    };

    //check whether cookie has the JWT token or not
    // if it doesn't redirect back to login page
    //if it does fetch the data
    if (!checkAuthStatus()) {
      //redirect to login page
      navigate("/");
    } else fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="problem-list-container">
      <h1 className="page-title">Problem Set</h1>
      <ul className="problem-list">
        {problemList.map((problem) => (
          <li className="problem-item" key={problem._id}>
            <Link to={`/load-problem/${problem._id}`} className="problem-link">
              <span className="problem-number">{problem.problemNumber}.</span>
              <span className="problem-name">{problem.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewProblems;
