import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; 
import { useLanguage } from '../../hooks/useLanguage'; 

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useLanguage();

  const isRTL = i18n.language === "ar";
  
  // Logical calculation for transform, but let's just use flex alignment or simple classes
  // If dark (moon), circle is far right (in LTR). If light (sun), circle is far left.
  // We can just rely on standard toggles or keep the transform logic simple.
  
  // Transform logic: 
  // LTR: Light = 0, Dark = 2rem (32px approx)
  // RTL: Light = 0, Dark = -2rem? standard CSS 'transform' doesn't automatically flip X unless logical properties used or explicitly handled.
  
  // Let's rely on standard conditional classes for simplicity and robustness.
  const translateClass = isRTL 
    ? (isDark ? '-translate-x-8' : 'translate-x-0') 
    : (isDark ? 'translate-x-8' : 'translate-x-0');

  return (
    <div>
      <div
        className="hidden md:block relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-colors duration-300"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm transform transition-transform duration-300 ${translateClass}`}
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
          <Moon className="text-white w-6 h-6" /> // Changed to white for dark mode visibility on dark bg
        ) : (
          <Sun className="text-yellow-500 w-6 h-6" />
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;

