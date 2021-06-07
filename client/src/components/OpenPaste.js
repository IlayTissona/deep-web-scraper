import React from "react";
import "../styles/OpenPaste.css";

function OpenPaste({ paste, close }) {
  return (
    <div id="full-screen-blur">
      <div id="open-paste">
        <button id="close-button" onClick={close}>
          X
        </button>
        <div className="paste-date">{new Date(paste.date).toDateString()}</div>
        <div className="paste-author">{paste.author}</div>
        <div className="paste-title">{paste.title}</div>
        <div className="paste-content">{paste.text}</div>
        <div className="paste-views">{paste.views}</div>
      </div>
    </div>
  );
}

export default OpenPaste;
