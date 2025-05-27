import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ links }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className="text-gray-700 dark:text-white hover:text-indigo-600 transition-colors duration-400 font-medium"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;

