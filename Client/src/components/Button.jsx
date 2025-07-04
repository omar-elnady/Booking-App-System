import React from "react";

const Button = ({ children, className = "", ...props }) => {
  const hasBgColor = className.includes("bg-");
  const hasHoverBg = className.includes("hover:bg-");

  return (
    <button
      {...props}
      className={`${className} ${!hasBgColor ? "bg-mainColor" : ""} ${
        !hasHoverBg ? "hover:bg-indigo-700" : ""
      } cursor-pointer transition duration-300 ease-in font-semibold py-1.5 px-4 rounded`}
    >
      {children}
    </button>
  );
};

export default Button;
