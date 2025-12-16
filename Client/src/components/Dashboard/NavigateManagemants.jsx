import React from "react";
import Button from "../Button";
import { Calendar1, Plus, FolderOpen, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

function NavigateManagemants({ activeTab = "singleEvent" , onTabChange }) {
  const { t } = useTranslation();
  const navigateButtons = [
    {
      label: t("manageEvents.tabSingle"),
      activeValue: "singleEvent",
      icon: <Calendar1 size={18} />,
    },
    {
      label: t("manageEvents.tabMulti"),
      activeValue: "multiLanguageEvent",
      icon: <Languages size={18} />,
    },
    {
      label: t("manageEvents.tabCategories"),
      activeValue: "categories",
      icon: <FolderOpen size={18} />,
    },
  ];
  return (
    <div className="w-full flex justify-center pb-2">
      <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {navigateButtons.map((button, index) => {
           const isActive = activeTab === button.activeValue;
           return (
            <Button
              key={index}
              onClick={() => onTabChange(button.activeValue)}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-blue-700 text-white shadow-sm dark:bg-blue-600"
                  : "text-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                 {button.icon}
              </span>
              {button.label}
            </Button>
           );
        })}
      </div>
    </div>
  );
}

export default NavigateManagemants;
