import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getLanguagesOptions } from "@/config/constants";

export const useLanguage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lng) => {
      i18n.changeLanguage(lng);
    },
    [i18n]
  );

  const languagesOptions = getLanguagesOptions(t, changeLanguage);

  const [selectedLang, setSelectedLang] = useState(() => {
    const currentLang = i18n.language || "en";
    return (
      languagesOptions.find((opt) => opt.value === currentLang) ||
      languagesOptions[0]
    );
  });

  const handleSetLang = (option) => {
    setSelectedLang(option);
    if (option.onClick) {
      option.onClick();
    }
  };

  return {
    t,
    i18n,
    selectedLang,
    languagesOptions,
    handleSetLang,
    changeLanguage,
  };
};
