import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18next from "i18next"; // Assumption: i18next setup exists

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: "en",

      setLanguage: (lang) => {
        i18next.changeLanguage(lang);
        set({ language: lang });
      },

      // Initialize language from storage or default
      init: () => {
        // Logic to sync with i18next on init could go here if needed
      },
    }),
    {
      name: "language-storage",
    }
  )
);
