import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
        {t("events.title")}
      </h1>

      <div className="md:w-[600px] m-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-4 mr-auto bg-neutral-50 dark:bg-neutral-900 focus:outline-0 focus:ring-0 rounded-lg p-2  backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 border border-transparent dark:border-slate-800"
        >
          <Input
            type="search"
            placeholder={t("events.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val === "") {
                handleSearch(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="flex-1  shadow-none border-none outline-none focus:ring-0 px-3 py-1 text-base transition-colors focus-visible:outline-none focus-visible:ring-0"
          />
          <Button type="submit" className="flex">
            <SearchIcon
              className={`w-5 h-5 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`}
            />
            {t("events.searchButton")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
