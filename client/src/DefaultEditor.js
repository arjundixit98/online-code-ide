import React, { useState, useEffect } from "react";
import "./stylesheets/loadproblem.css";
import Editor from "./Editor";
import CodeOutputView from "./CodeOutputView";
import { checkAuthStatus } from "./service/auth";
import { useNavigate } from "react-router-dom";
const DefaultEditor = () => {
  const [codeOutput, setCodeOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [timeoutError, setTimeoutError] = useState("");

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [runtime, setRuntime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthStatus()) {
      //redirect to login page
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="load-problem-page">
      <main>
        <div className="editor-container">
          <Editor
            problemId={null}
            setCodeOutput={setCodeOutput}
            setRuntime={setRuntime}
            setErrorOutput={setErrorOutput}
            setSubmitButtonClicked={setSubmitButtonClicked}
            setTimeoutError={setTimeoutError}
            height={"350px"}
          />
          {submitButtonClicked ? (
            <CodeOutputView
              codeOutput={codeOutput}
              runtime={runtime}
              errorOutput={errorOutput}
              submitButtonClicked={submitButtonClicked}
              timeoutError={timeoutError}
            />
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
};
export default DefaultEditor;
