import React from "react";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const EventsFullCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const handleGoToEvent = (event) => {
    navigate(`/events/${event._id || event.id}`);
  };

  const getContent = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.en || "";
  };

  const eventName = getContent(event.name);
  const eventDesc = getContent(event.description);
  const eventVenue = getContent(event.venue);
  const categoryName = event.category?.name
    ? getContent(event.category.name)
    : getContent(event.category) || "General";

  const imageUrl =
    event.image?.secure_url ||
    (typeof event.image === "string" ? event.image : null) ||
    "/placeholder-event.jpg";

  return (
    <div
      className="relative w-5/6 mx-auto overflow-hidden   rounded-2xl"
      key={event._id}
    >
      <span
        className={`absolute z-20 ${
          lang === "ar" ? "right-8 top-5" : "left-8 top-5"
        } dark:bg-white bg-black text-white dark:text-black px-2 py-1 rounded text-sm`}
      >
        {categoryName}
      </span>

      <div className="rounded-2xl mx-auto flex md:items-stretch flex-col md:flex-row justify-between bg-white dark:bg-black border border-gray-400 dark:border-gray-600 md:h-[300px] relative select-none">
        <div className={`md:w-[45%] w-full md:h-full h-[250px] flex-shrink-0 `}>
          <img
            src={imageUrl}
            alt={eventName}
            className={`w-full h-full object-cover ${
              lang === "ar"
                ? "md:rounded-r-2xl rounded-r-2xl"
                : "md:rounded-l-2xl rounded-l-2xl"
            }`}
          />
        </div>

        <div className="hidden md:flex relative items-center justify-center w-0 mx-4 perforation-separator">
          <div className="perforation-line"></div>
          <div className="perforation-cutout perforation-cutout-top"></div>
          <div className="perforation-cutout perforation-cutout-bottom"></div>
        </div>

        <div className="md:w-[55%] flex flex-col gap-2 justify-between h-full px-6 py-5 md:px-4 md:py-7 flex-grow z-0">
          <div className="flex flex-col gap-2 flex-grow">
            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">
              {eventName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
              {eventDesc.length > 100
                ? eventDesc.slice(0, 100) + "..."
                : eventDesc}
            </p>
            <div className="text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <CalendarClock size={16} />{" "}
                {event.date
                  ? new Date(event.date).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US"
                    )
                  : "TBA"}
              </span>
              {event.time && (
                <span className="flex items-center gap-2 border-s border-gray-400 ps-4 h-4 leading-none">
                  {event.time}
                </span>
              )}
            </div>
            <span className="text-gray-600 dark:text-gray-400 gap-2 flex items-center text-sm">
              <MapPin size={16} /> {eventVenue}
            </span>
            <span className="text-gray-600 dark:text-gray-400 gap-2 flex items-center text-sm">
              <Banknote size={16} /> {event.price} {t("common.currency")}
            </span>
          </div>
          <div className="mt-auto pt-2">
            <Button
              onClick={() => handleGoToEvent(event)}
              className={cn(
                "w-full md:w-auto",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsFullCard;
