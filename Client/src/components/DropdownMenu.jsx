import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const DropdownMenu = ({
  menuName,
  classMenuBtn,
  items,
  classList,
  cancelDefultStyle,
  useDorpIcon,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={`${
            !cancelDefultStyle
              ? `transition ease-in-out duration-300 inline-flex gap-2 justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${classMenuBtn}`
              : ` ${classMenuBtn}`
          }`}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          {menuName}
          {useDorpIcon && (
            <ChevronDown
              className={`${i18n.dir() === "rtl" ? "mr-2 -ml-1" : "ml-2 -mr-1"} h-5 w-5`}
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full mt-3 w-56 rounded-md shadow-lg bg-white ring-1 ring-gray-500 ring-opacity-5 focus:outline-none z-10 transition ease-in-out duration-300"
          style={{ insetInlineEnd: 0 }} // يحل محل right: 0 ويدعم RTL
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          dir={i18n.dir()}
        >
          <div className="py-1" role="none">
            {items?.map((item, index) => (
              <Link
                to={item?.to}
                key={index}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${classList}`}
                role="menuitem"
                onClick={handleLinkClick}
              >
                {item?.icon && (
                  <item.icon
                    className={`h-5 w-5 text-gray-400 ${
                      i18n.dir() === "rtl" ? "ml-3" : "mr-3"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {item?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;