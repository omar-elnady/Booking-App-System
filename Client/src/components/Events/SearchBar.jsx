import React from "react";
import { useTranslation } from "react-i18next";
import Input from "../Input";
import Button from "../Button";
import { SearchIcon } from "lucide-react";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-textDark mb-6 text-center">
        {t("events.title")}
      </h1>

      <div className="md:w-[600px] m-auto">
        <div className="flex gap-4 mr-auto bg-white dark:bg-darkCard rounded-lg p-2 shadow-lg backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
          <Input
            type="text"
            placeholder={t("events.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-0  focus:ring-0 bg-transparent text-gray-900 dark:text-gray-300"
          />
          <Button onClick={handleSearch} className="flex">
            <SearchIcon
              className={`w-5 h-5 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("events.searchButton")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
