import React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      // dark:text-textDark
      className={`w-full  border border-gray-300 outline-indigo-600 px-3 rounded  ${className}`}
      {...props}
      ref={ref}
    />
  );
});

export default Input;
