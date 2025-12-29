import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SearchFilters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
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

  return (
    <Card className="w-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">{t("sortOpition.filters")}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-black dark:text-white">
            {t("sortOpition.sortBy")}
          </label>
          <div className="space-y-2">
            {sortOptions?.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <input
                  id={option.value}
                  name="sort-by"
                  type="radio"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => onSortChange(option.value)}
                  className={`h-5 w-5 border-gray-300 dark:border-gray-600 text-mainColor focus:ring-mainColor cursor-pointer accent-mainColor ${
                    isRTL ? "ml-3" : "mr-3"
                  }`}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-3">
            {t("categories")}
          </label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {categories?.map((category) => (
              <label
                key={category}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <input
                  id={category}
                  name={category}
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => onCategoryChange(category, e.target.checked)}
                  className={`h-5 w-5 rounded border-gray-300 dark:border-gray-600 checked:bg-mainColor checked:border-mainColor focus:ring-mainColor cursor-pointer transition-all ${
                    isRTL ? "ml-3" : "mr-3"
                  }`}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {selectedCategories?.length > 0 && (
          <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
            <Button
              onClick={onClearFilters}
              variant="link"
              className="text-red-500 hover:text-red-700 p-0"
            >
              {t("clearFilters")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
