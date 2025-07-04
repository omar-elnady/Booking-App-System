import React from "react";
import { EventSingleForm } from "./EventSingleForm";
import { EventCardDashboard } from "./EventCardDashbord";
import { CalendarDays } from "lucide-react";
import { events } from "../../lib/Events";

function ManaageEvents() {
  const handleEventAdded = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const eventsByCategory = events.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {});
  const categories = [
    "Music & Concerts",
    "Technology",
    "Sports",
    "Arts & Theater",
    "Food & Drink",
    "Business",
    "Health & Wellness",
    "Education",
  ];
  return (
    <>
      <EventSingleForm
        onEventAdded={handleEventAdded}
        categories={categories}
      />

      {/* Events by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Events by Category
        </h2>

        {Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                {category}
              </h3>
              <span className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
                {categoryEvents.length} events
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {categoryEvents.map((event) => (
                <EventCardDashboard
                  key={event.id}
                  event={event}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No events created yet
            </h3>
            <p className="text-slate-500">
              Create your first event using the form above.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default ManaageEvents;
