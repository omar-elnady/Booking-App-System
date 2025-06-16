import React from "react";

function Input({ className, ...props }) {
  return (
    <input
      className={`w-full  border border-gray-300 outline-indigo-600 px-3 rounded dark:text-textDark ${className}`}
      {...props}
    />
  );
}

export default Input;
