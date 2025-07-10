import React from "react";

function Input({ className, ...props }) {
  return (
    <input
    // dark:text-textDark
      className={`w-full  border border-gray-300 outline-indigo-600 px-3 rounded  ${className}`}
      {...props}
    />
  );
}

export default Input;
