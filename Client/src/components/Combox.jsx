import { ArrowBigDown, ArrowBigUp, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const CustomDropdown = ({ value, setValue, options, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (v) => {
    setValue(v);
    setIsOpen(false);
  };

  console.log(value);
  return (
    <div>
      <div className="dropdown-container">
        <div className="dropdown-header" onClick={toggleDropdown}>
          <span className="flex  gap-2 items-center">
            {" "}
            {value.label}
            {value?.img && (
              <img src={value.img} className="w-6 h-5 rounded-xs " alt="img" />
            )}
          </span>
          <span className={`arrow ${isOpen ? "open" : ""}`}>
            <ChevronDown />
          </span>
        </div>
        {isOpen && (
          <ul className="dropdown-list">
            {options?.map((option, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => {
                  handleSelect(option);
                  option.onClick();
                }}
                {...props}
              >
                {option.label}
                {option.img && (
                  <img src={option.img} className="w-6 rounded-xs " alt="img" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
