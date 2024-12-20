import React, { useState } from "react";
import "./stylesheets/loadproblem.css";
import Editor from "./Editor";
import CodeOutputView from "./CodeOutputView";

const DefaultEditor = () => {
  const [codeOutput, setCodeOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [timeoutError, setTimeoutError] = useState("");

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [runtime, setRuntime] = useState("");

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
