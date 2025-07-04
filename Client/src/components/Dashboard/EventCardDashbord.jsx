import React from "react";
import { CalendarDays, MapPin, Users, Trash2 } from "lucide-react";

export const EventCardDashboard = ({ event, onDelete }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg hover:shadow-lg transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{event.name}</h3>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {event.description && (
          <p className="text-sm text-slate-600 mt-2">{event.description}</p>
        )}
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm">
              {event.date} {event.time && `at ${event.time}`}
            </span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{event.venue}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">{event.capacity} capacity</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-800">
              ${event.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
