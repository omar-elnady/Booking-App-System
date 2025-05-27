import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import Button from "../components/Button";
import { events } from "../lib/Events";
import SearchFilters from "../components/SearchFilters";
import EventCard from "../components/EventsCards";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";

const Events = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1); 
  const eventsPerPage = 3;

  const categories = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.category))).sort();
  }, [events]);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }

    // Sort events
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "date":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [events, searchQuery, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredAndSortedEvents.slice(startIndex, endIndex);
  }, [filteredAndSortedEvents, currentPage]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1); 
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
    setCurrentPage(1); 
  };

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkMainBg">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-cardForeground mb-6 text-center">
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
                <SearchIcon className="w-5 h-5 mr-2" />
                {t("events.searchButton")}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-80 flex-shrink-0">
            <SearchFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-300">
                {i18n.language === "en" ? filteredAndSortedEvents.length : null}
                {filteredAndSortedEvents.length !== 1
                  ? t("events.evnets") + t("events.founds")
                  : t("events.event") + t("events.found")}
                {i18n.language === "ar"
                  ? ` : ` + filteredAndSortedEvents.length
                  : null}

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

            {paginatedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    // onBook={bookEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <SearchIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-cardForeground mb-2">
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
