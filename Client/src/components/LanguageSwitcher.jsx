import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { i18n, handleSetLang, languagesOptions } = useLanguage();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const nextLang = languagesOptions.find(
      (lang) => lang.value !== currentLang
    );
    if (nextLang) {
      handleSetLang(nextLang);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
      aria-label="Switch language"
    >
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
        {i18n.language}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
