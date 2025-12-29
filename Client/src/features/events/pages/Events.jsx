import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@features/events/components/EventsCards";
import Pagination from "@/components/Pagination";
import SearchBar from "@features/events/components/SearchBar";
import EventsList from "@features/events/components/EventsList";
import NoResult from "@features/events/components/NoResult";
import SearchFilters from "@features/events/components/SearchFilters";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const categoriesParam = searchParams.get("categories");

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategories, setSelectedCategories] = useState(
    categoriesParam ? categoriesParam.split(",") : []
  );
  const [sortBy, setSortBy] = useState(sortParam);

  // Updates when URL params change (e.g. back button)
  React.useEffect(() => {
    setSearchQuery(searchParam);
    setSortBy(sortParam);
    setSelectedCategories(categoriesParam ? categoriesParam.split(",") : []);
  }, [searchParam, sortParam, categoriesParam]);

  // Fetch Categories
  const { data: categoriesData } = useCategories();
  const categories =
    categoriesData?.categories?.map((cat) => cat.name?.en || cat.name) || [];

  const { data, isLoading, isError, error } = useEvents({
    page: pageParam,
    size: 9,
    search: searchParam,
    categories: categoriesParam || "", // Use param directly for consistency
    sortBy: sortParam,
  });

  const handleCategoryChange = (category, isChecked) => {
    const nextCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);

    setSelectedCategories(nextCategories);

    setSearchParams({
      search: searchQuery,
      page: 1, // Reset to page 1 on filter change
      sort: sortBy,
      categories: nextCategories.join(","),
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setSearchParams({
      search: searchQuery,
      page: 1,
      sort: value,
      categories: selectedCategories.join(","),
    });
  };

  const handleSearch = (queryOverride) => {
    const query =
      typeof queryOverride === "string" ? queryOverride : searchQuery;
    setSearchParams({
      search: query,
      page: 1,
      sort: sortBy,
      categories: selectedCategories.join(","),
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      search: searchParam,
      page: newPage,
      sort: sortParam,
      categories: categoriesParam || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("newest");
    setSearchParams({});
  };

  // Only show full loading spinner on initial load (when no data exists)
  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-mainColor" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-red-500">
        <p className="text-xl font-semibold">Error loading events</p>
        <p>{error?.response?.data?.message || "Something went wrong"}</p>
      </div>
    );
  }

  const { events, totalPages } = data || {};

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar with filters */}
          <div className="lg:w-64 flex-shrink-0">
            <SearchFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onClearFilters={resetFilters}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <EventsList
              filteredAndSortedEvents={events || []}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
            />

            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event._id || event.id} // Flexible ID access
                    event={event}
                    // onBook={bookEvent}
                  />
                ))}
              </div>
            ) : (
              <NoResult
                setSearchParams={setSearchParams}
                // setCurrentPage mock since we use URL state
                setCurrentPage={(p) =>
                  setSearchParams({ search: searchParam, page: p })
                }
                setSearchQuery={setSearchQuery}
                setSelectedCategories={setSelectedCategories}
                resetCustom={resetFilters}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
