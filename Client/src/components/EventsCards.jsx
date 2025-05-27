import React from "react";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

const EventCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="card relative  overflow-hidden group" key={event._id}>
      <span
        className={`absolute ${
          lang === "ar" ? "right-2 top-2" : "left-2 top-2"
        } bg-indigo-600 text-white px-2  py-1 rounded z-10`}
      >
        {event.category}
      </span>
      <div className=" md:h-[500px] h-[460px]  flex md:items-center rounded-2xl overflow-hidden  flex-col   justify-between  bg-white dark:bg-darkCard border  border-gray-300 dark:border-gray-700  ">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="  md:flex-2 flex flex-col gap-2  justify-between h-full py-5 px-3">
          <div className=" flex flex-col gap-2 h-full   ">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white  line-clamp-2 group-hover:text-blue-600 transition-colors">
              {event.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
              {event.description.length > 60
                ? event.description.slice(0, 100) + "..."
                : event.description}
            </p>
            <span className="text-sm dark:text-gray-300 text-gray-700 gap-2 flex">
              <CalendarClock className="w-4 h-4" />{" "}
              {event.date.replaceAll("-", "/")} • {event.time}
            </span>
            <span className="text-sm dark:text-gray-300 text-gray-700 gap-2 flex">
              <MapPin className="w-4 h-4" /> {event.venue}
            </span>
            <span className="text-sm dark:text-gray-300 text-gray-700 gap-2 flex">
              <Banknote className="w-4 h-4" /> {event.price} EGP
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
      </div>
    </div>
  );
};

export default EventCard;
