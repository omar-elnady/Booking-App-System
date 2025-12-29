// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import translationEN from "../locales/en/translation.json";
import translationAR from "../locales/ar/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

const updateDirection = (lng) => {
  if (lng === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    // Optional: Add a class to body for RTL-specific CSS rules
    // document.body.classList.add('rtl');
    // document.body.classList.remove('ltr');
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    // Optional: Add a class to body for LTR-specific CSS rules
    // document.body.classList.add('ltr');
    // document.body.classList.remove('rtl');
  }
};

// Update direction initially based on the detected language
updateDirection(i18n.language);

// Listen for language changes and update direction
i18n.on("languageChanged", (lng) => {
  updateDirection(lng);
});

export default i18n;
