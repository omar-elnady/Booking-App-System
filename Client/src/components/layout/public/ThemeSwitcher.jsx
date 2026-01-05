import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-600" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
