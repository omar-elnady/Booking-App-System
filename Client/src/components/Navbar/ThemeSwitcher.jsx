import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; 
import { useLanguage } from '../../hooks/useLanguage'; 

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useLanguage(); 

  const getTranslateClass = () => {
    if (i18n.language === 'ar') {
      return isDark ? '-translate-x-8' : '-translate-x-0';
    } else {
      return isDark ? 'translate-x-0' : 'translate-x-8';
    }
  };

  return (
    <div>
      <div
        className="hidden md:block relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} 
      >
        <div
          className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transform transition-transform duration-300 ${getTranslateClass()}`}
        >
          {isDark ? (
            <Moon className="text-gray-700 w-4 h-4" /> 
          ) : (
            <Sun className="text-yellow-500 w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className="block md:hidden relative rounded-full p-1 cursor-pointer"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Moon className="text-gray-300 w-6 h-6" />
        ) : (
          <Sun className="text-yellow-500 w-6 h-6" />
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;

