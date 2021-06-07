import React from "react";
import "../styles/OpenPaste.css";

function OpenPaste({ paste, close }) {
  const clickHandler = (e) => {
    console.log(e.target.id);
    if (e.target.id === "open-paste" || e.target.parentNode.id === "open-paste")
      return;
    close();
  };
  return (
    <div id="full-screen-blur" onClick={clickHandler}>
      <div id="open-paste">
        <button id="close-button" onClick={close}>
          X
        </button>
        <div className="paste-title">{paste.title}</div>
        <div className="paste-content">{paste.text}</div>
        <div className="paste-meta">
          Posted By {paste.author} at {new Date(paste.date).toDateString()}
          <br />
          Original Link: {paste.link}
        </div>
      </div>
    </div>
  );
}

export default OpenPaste;
