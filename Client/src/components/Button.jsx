import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 cursor-pointer transition duration-300 ease-in  font-semibold py-1.5 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
