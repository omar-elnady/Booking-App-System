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
      <p className="text-gray-600 dark:text-gray-300">
        {i18n.language === "en" ? filteredAndSortedEvents.length : null}
        {filteredAndSortedEvents.length !== 1
          ? t("events.evnets") + t("events.founds")
          : t("events.event") + t("events.found")}
        {i18n.language === "ar" ? ` : ` + filteredAndSortedEvents.length : null}

        {searchQuery && (
          <span className="ml-1">
            {t("events.for")} "
            <span className="font-semibold text-gray-900 dark:text-cardForeground">
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
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
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
