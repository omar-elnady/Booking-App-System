import React, { act } from "react";
import Button from "../Button";
import { Calendar1, Plus, FolderOpen, Languages } from "lucide-react";

function NavigateManagemants({ activeTab = "singleEvent" , onTabChange }) {
  const navigateButtons = [
    {
      label: "Single Events",
      activeValue: "singleEvent",
      icon: <Calendar1 size={18} />,
    },
    {
      label: "Multi-language Events",
      activeValue: "multiLanguageEvent",
      icon: <Languages size={18} />,
    },
    {
      label: "Categories",
      activeValue: "categories",
      icon: <FolderOpen size={18} />,
    },
  ];
  return (
    <div className="w-full flex items-center  border border-gray-200 rounded-md p-2 gap-3">
      {navigateButtons.map((button, index) => (
        <Button
          key={index}
          className={`flex items-center gap-2 ${
            activeTab === button.active
              ? "bg-mainColor text-white"
              : "bg-white text-gray-900 border hover:bg-slate-50 border-gray-200"
          }`}
          onClick={(e) => {onTabChange(button.activeValue)}}
        >
          {button.icon}
          {button.label}
        </Button>
      ))}
    </div>
  );
}

export default NavigateManagemants;
