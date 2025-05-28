import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SearchFilters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const sortOptions = [
    { value: "newest", label: t("sortOpition.newest") },
    { value: "popular", label: t("sortOpition.popular") },
    { value: "price-low", label: t("sortOpition.priceLowToHigh") },
    { value: "price-high", label: t("sortOpition.priceHighToLow") },
    { value: "date", label: t("sortOpition.date") },
  ];

  const handleClearFilters = () => {
    categories.forEach((cat) => onCategoryChange(cat, false));
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: isRTL ? 10 : -10,
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
    hover: { scale: 1.04 },
    // tap: { scale: 0.95 },
  };

  return (
    <div className="w-full bg-white dark:bg-darkCard rounded-lg shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-textDark">
          {t("sortOpition.filters")}
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("sortOpition.sortBy")}
          </label>
          <div className="space-y-2">
            {sortOptions?.map((option, index) => (
              <motion.div
                key={option.value}
                className="flex items-center"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <input
                  id={option.value}
                  name="sort-by"
                  type="radio"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => onSortChange(option.value)}
                  className={`h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 cursor-pointer ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {option.label}
                </label>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("categories")}
          </label>
          <div className="space-y-3">
            {categories?.map((category, index) => (
              <motion.div
                key={category}
                className="flex items-center"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <input
                  id={category}
                  name={category}
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => onCategoryChange(category, e.target.checked)}
                  className={`h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 cursor-pointer ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                />
                <label
                  htmlFor={category}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {category}
                </label>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedCategories?.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClearFilters}
              className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none"
            >
              {t("clearFilters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
