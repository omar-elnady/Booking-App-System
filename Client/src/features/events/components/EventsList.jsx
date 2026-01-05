import React from "react";
import { useTranslation } from "react-i18next";

function EventsList({
  filteredAndSortedEvents,
  selectedCategories,
  searchQuery,
}) {
  const { t, i18n } = useTranslation();
  return (
    <div className="mb-5 flex items-center justify-between">
      <p className="text-black dark:text-gray-300">
        {i18n.language === "en" ? filteredAndSortedEvents.length : null}
        {filteredAndSortedEvents.length !== 1
          ? t("events.events") + " " + t("events.founds")
          : t("events.event") + " " + t("events.found")}
        {i18n.language === "ar" ? ` : ` + filteredAndSortedEvents.length : null}

        {searchQuery && (
          <span className="ml-1">
            {t("events.for")} "
            <span className="font-semibold text-black dark:text-textDark">
              {searchQuery}
            </span>
            "
          </span>
        )}
      </p>

      {(selectedCategories.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="bg-gray-100 text-black border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;
