import React from "react";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

const EventsFullCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  console.log(lang);

  return (
    <div className="card relative " key={event._id}>
      <span
        className={`absolute ${
          lang === "ar" ? "right-8 top-5" : "left-8 top-5"
        } bg-indigo-600 text-white px-2 py-1 rounded`}
      >
        {event.category}
      </span>
      <div className=" flex md:items-center flex-col md:flex-row   justify-between  bg-white dark:bg-darkCard border-2 border-gray-300 dark:border-gray-700  md:h-[300px]">
        <img
          src={event.image}
          alt={event.title}
          className="md:flex-3 md:h-full w-full h-[300px]  "
        />
        <div className="  md:flex-2 flex flex-col gap-2  justify-between h-full px-10 py-5  md:px-4 md:py-7 ">
          <div className=" flex-2 flex flex-col gap-2 h-full   ">
            <h2 className="text-2xl md:text-3xl font-bold   text-gray-900 dark:text-cardForeground">
              {event.title}
            </h2>
            <p className="text-base text-gray-800  dark:text-gray-200">
              {event.description.length > 60
                ? event.description.slice(0, 60) + "..."
                : event.description}
            </p>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex">
              <CalendarClock /> {event.date.replaceAll("-", "/")} • {event.time}
            </span>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex">
              <MapPin /> {event.venue}
            </span>
            <span className="dark:text-gray-300 text-gray-700 gap-2 flex">
              <Banknote /> {event.price} {t("currency")}
            </span>
          </div>
          <Button
            href={event.link}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("bookNow")}
          </Button>
        </div>
        <div className="absolute top-0 left-0 w-10 h-10 bg-lightMainBg dark:bg-darkMainBg rounded-full -translate-x-2 translate-y-[-50%]"></div>
        <div className="absolute top-0 right-0 w-10 h-10 bg-lightMainBg dark:bg-darkMainBg rounded-full translate-x-2 translate-y-[-50%]"></div>
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-lightMainBg dark:bg-darkMainBg rounded-full -translate-x-2 translate-y-[50%]"></div>
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-lightMainBg dark:bg-darkMainBg rounded-full translate-x-2 translate-y-[50%]"></div>
      </div>
    </div>
  );
};

export default EventsFullCard;
