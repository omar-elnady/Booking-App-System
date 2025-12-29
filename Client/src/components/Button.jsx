import React from "react";
import { Button as ShadcnButton } from "./ui/button";

const Button = ({ children, className = "", ...props }) => {
  return (
    <ShadcnButton 
      className={className} 
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
