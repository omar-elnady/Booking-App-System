import { SearchIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";

function NoResult({
  setSearchQuery,
  setSelectedCategories,
  setSearchParams,
  setCurrentPage,
}) {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        <SearchIcon className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-textDark mb-2">
        {t("events.noEventsFound")}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t("events.adjustSearch")}
      </p>
      <Button
        onClick={() => {
          setSearchQuery("");
          setSelectedCategories([]);
          setSearchParams({});
          setCurrentPage(1);
        }}
        variant="outline"
      >
        {t("clearFilters")}
      </Button>
    </div>
  );
}

export default NoResult;
