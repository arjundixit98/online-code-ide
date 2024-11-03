import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "./stylesheets/editor.css";

function Editor({
  problemId,
  setCodeOutput,
  setRuntime,
  setErrorOutput,
  setSubmitButtonClicked,
  height,
  width,
  setTimeoutError,
}) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  let intervalId;
  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
  };

  const renderTimeDetails = (startedAt, completedAt) => {
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, "seconds", true);
    return `${executionTime}`;
  };

  const fetchData = async (jobId) => {
    const { data: dataRes } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/status`,
      { params: { id: jobId } }
    );

    const { job, success, error } = dataRes;

    if (success) {
      const {
        status: jobStatus,
        output: jobOutput,
        startedAt,
        completedAt,
      } = job;
      console.log(jobStatus, jobOutput);
      if (jobStatus === "pending") return;
      else if (jobStatus === "error") {
        setErrorOutput(jobOutput);
        setTimeoutError("");
      } else {
        setCodeOutput(jobOutput);
        setRuntime(renderTimeDetails(startedAt, completedAt));
        setTimeoutError("");
      }
      clearInterval(intervalId);
    } else {
      console.log(error);
      setErrorOutput(error);
      setTimeoutError("");
      clearInterval(intervalId);
    }
  };

  const handleSubmit = async () => {
    const startTime = Date.now();
    const TIMEOUT_LIMIT = 10000;

    const payload = {
      language,
      code,
      problemId,
    };
    try {
      setCodeOutput("");
      setErrorOutput("");
      setSubmitButtonClicked(true);
      const {
        data: { jobId },
      } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/run`, payload);

      intervalId = setInterval(() => {
        // Check if timeout limit is reached
        if (Date.now() - startTime > TIMEOUT_LIMIT) {
          console.log("Request timed out. Please try again later.");
          setTimeoutError("Request timed out. Please try again later.");
          setErrorOutput("");
          setCodeOutput("");
          clearInterval(intervalId); // Stop polling
        } else {
          fetchData(jobId);
        }
      }, 1000);

      // let intervalId;
      // intervalId = setInterval(async () => {

      //   fetchData();
      // }, 1000);
    } catch ({ response }) {
      console.log(response);
      if (response) {
        console.log(`Got Axios error : `);
        setErrorOutput("");
        setCodeOutput("");
      } else {
        console.log("Error connecting to server!");
        setCodeOutput("Error connecting to server!");
      }
    }
  };

  return (
    <div className="editor">
      <div className="select-lang-container">
        <label className="label-lang">Select a language : </label>
        <select
          className="custom-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
        <button className="btn-default" onClick={setDefaultLanguage}>
          Set Default
        </button>
      </div>

      <CodeMirror
        className="code-mirror-editor"
        value={code}
        height={height}
        width={width}
        extensions={[javascript({ jsx: true })]}
        onChange={(e) => {
          setCode(e);
        }}
        theme={vscodeDark}
      />
      <button className="btn-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Editor;
