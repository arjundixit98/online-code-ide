import React from "react";
import "./stylesheets/codeoutputview.css";

const CodeOutputView = ({
  codeOutput,
  runtime,
  errorOutput: errorString,
  submitButtonClicked,
  timeoutError,
}) => {
  let errorOutput = "";
  if (errorString) {
    try {
      errorOutput = JSON.parse(errorString).stderr;
    } catch (err) {
      errorOutput = errorString;
    }
  }

  return (
    <div className="results">
      {codeOutput ? (
        <div className="exec-time">
          <div>Execution Time: {runtime}s</div>
        </div>
      ) : errorOutput ? (
        <div className="exec-time">
          <div>Compilation Error...</div>
        </div>
      ) : timeoutError ? (
        <div className="exec-time">
          <div>Server Timeout Error...</div>
        </div>
      ) : submitButtonClicked ? (
        <div className="exec-time">
          <div>Submission Queued...</div>
        </div>
      ) : (
        <div></div>
      )}

      {codeOutput && (
        <>
          <p className="out1">Your Output</p>
          <div className="output1">{codeOutput}</div>
        </>
      )}

      {errorOutput && (
        <>
          <p className="error1">Error</p>
          <div className="output1">{errorOutput}</div>
        </>
      )}

      {timeoutError && (
        <>
          <p className="error1">Timeout error</p>
          <div className="output1">{timeoutError}</div>
        </>
      )}
    </div>
  );
};

export default CodeOutputView;
