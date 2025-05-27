import React from "react";
import CustomDropdown from "../Combox";
import { useLanguage } from "../../hooks/useLanguage";

const LanguageSwitcher = () => {
  const { i18n, selectedLang, languagesOptions, handleSetLang } = useLanguage();

  return (
    <div
      className={`items-center space-x-2 ${
        i18n.language === "en" ? "border-r pr-4 mr-4" : "border-l pl-4 ml-4"
      } border-gray-300 dark:border-gray-600 hidden md:flex`}
    >
      <CustomDropdown
        value={selectedLang}
        options={languagesOptions}
        setValue={handleSetLang}
      />
    </div>
  );
};

export default LanguageSwitcher;
