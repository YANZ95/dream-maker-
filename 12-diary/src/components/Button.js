import React from "react";
import "./Button.css";

function Button({ text, onClick, type, className }) {
  const btnClass = ["positive", "negative"].includes(type) ? type : "default";
  const loginClass = className ? "btn_login" : "";
  return (
    <button className={`btn btn_${btnClass} ${loginClass}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
