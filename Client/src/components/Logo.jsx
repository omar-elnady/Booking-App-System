import React from "react";
import { Link } from "react-router-dom";
import { MousePointerClick } from "lucide-react";

const Logo = ({ logoText }) => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">
          <MousePointerClick />
        </span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white ">
        {logoText}
      </span>
    </Link>
  );
};

export default Logo;
