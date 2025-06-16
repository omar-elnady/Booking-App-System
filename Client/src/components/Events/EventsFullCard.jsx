import React from "react";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EventsFullCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const handleGoToEvent = (event) => {
    navigate(`/events/eventId=${event.id}`);
  };

  return (
    <div className="relative w-5/6 mx-auto overflow-hidden  rounded-2xl" key={event._id}>
      <span
        className={`absolute z-20 ${
          lang === "ar" ? "right-8 top-5" : "left-8 top-5"
        } bg-mainColor text-white px-2 py-1 rounded text-sm`}
      >
        {event.category}
      </span>

      <div
        className={`rounded-2xl mx-auto   flex md:items-stretch flex-col md:flex-row justify-between bg-white dark:bg-darkCard border-2 border-gray-300 dark:border-gray-700 md:h-[300px] relative `}
      >
        <div className={`md:w-[45%] w-full md:h-full h-[250px] flex-shrink-0 `}>
          <img
            src={event.image}
            alt={event.name}
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
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-textDark">
              {event.name}
            </h2>
            <p className="text-sm text-gray-800 dark:text-gray-200 flex-grow">
              {event.description.length > 100
                ? event.description.slice(0, 100) + "..."
                : event.description}
            </p>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex items-center text-sm">
              <CalendarClock size={16} /> {event.date.replaceAll("-", "/")} •{" "}
              {event.time}
            </span>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex items-center text-sm">
              <MapPin size={16} /> {event.venue}
            </span>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex items-center text-sm">
              <Banknote size={16} /> {event.price} {t("currency")}
            </span>
          </div>
          <div className="mt-auto pt-2">
            <Button
              onClick={() => handleGoToEvent(event)}
              className="bg-indigo-500 hover:bg-mainColor text-white font-semibold py-2 px-4 rounded transition-colors w-full md:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("bookNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsFullCard;
