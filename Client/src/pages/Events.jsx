import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { events } from "../lib/Events";
import SearchFilters from "../components/Events/SearchFilters";
import EventCard from "../components/Events/EventsCards";
import Pagination from "../components/Events/Pagination";
import SearchBar from "../components/Events/SearchBar";
import EventsList from "../components/Events/EventsList";
import NoResult from "../components/Events/NoResult";
import { usePagination } from "../hooks/usePagination";
import { useEvent } from "../hooks/useEvent";

const Events = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleKeyPress,
    selectedCategories,
    setSelectedCategories,
    handleCategoryChange,
    categories,
    sortBy,
    setSortBy,
    filteredAndSortedEvents,
    searchParams,
    setSearchParams,
  } = useEvent(events);

  const { currentPage, setCurrentPage, totalPages, paginationItems } =
    usePagination(filteredAndSortedEvents);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams, setSearchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkMainBg">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-64 flex-shrink-0">
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
            <EventsList
              filteredAndSortedEvents={filteredAndSortedEvents}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
            />

            {paginationItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginationItems.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    // onBook={bookEvent}
                  />
                ))}
              </div>
            ) : (
              <NoResult
                setSearchParams={setSearchParams}
                setCurrentPage={setCurrentPage}
                setSearchQuery={setSearchQuery}
                setSelectedCategories={setSelectedCategories}
              />
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
