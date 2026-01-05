import React from "react";
import { Link } from "react-router-dom";
import { MousePointerClick } from "lucide-react";

const Logo = ({ logoText }) => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold text-gray-900 dark:text-white ">
        {logoText}
      </span>
    </Link>
  );
};

export default Logo;
