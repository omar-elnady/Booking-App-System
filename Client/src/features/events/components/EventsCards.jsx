import React from "react";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const EventCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const handleGoToEvent = (event) => {
    navigate(`/events/${event._id || event.id}`);
  };

  return (
    <Card
      className="relative overflow-hidden group h-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
      key={event._id}
      onClick={() => handleGoToEvent(event)}
    >
      <span
        className={`absolute ${
          lang === "ar" ? "right-2 top-2" : "left-2 top-2"
        } bg-background  px-2  py-1 rounded z-10`}
      >
        {event.category || "General"}
      </span>
      <div className="flex flex-col h-full">
        <img
          src={event.image?.secure_url || event.image}
          alt={event.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <CardContent className="md:flex-2 flex flex-col gap-2 justify-between h-full py-5 px-3">
          <div className="flex flex-col gap-2 h-full">
            <h2 className="text-xl font-bold text-black dark:text-white line-clamp-2">
              {event.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
              {event.description?.length > 60
                ? event.description.slice(0, 100) + "..."
                : event.description}
            </p>
            <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
              <CalendarClock className="w-4 h-4" />{" "}
              {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
              {event.time && ` • ${event.time}`}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
              <MapPin className="w-4 h-4" /> {event.venue}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
              <Banknote className="w-4 h-4" /> {event.price}{" "}
              {t("common.currency")}
            </span>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleGoToEvent(event);
            }}
            className={cn(
              "w-full mt-2 font-bold",
              event.status === "Cancelled" ||
                event.status === "Sold Out" ||
                event.availableTickets === 0
                ? "bg-gray-400 text-white"
                : "bg-primary text-white"
            )}
            disabled={
              event.status === "Cancelled" ||
              event.status === "Sold Out" ||
              event.availableTickets === 0
            }
            variant={event.status === "Cancelled" ? "destructive" : "default"}
          >
            {event.status === "Cancelled"
              ? t("dashboard.status.cancelled") || "Cancelled"
              : event.status === "Sold Out" || event.availableTickets === 0
              ? t("dashboard.status.soldOut") || "Sold Out"
              : t("buttons.bookNow")}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventCard;
