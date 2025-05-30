import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

function Details({ event, isAuthenticated, isBooked }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      <div className="space-y-2 flex flex-col items-start">
        <span className=" bg-mainColor hover:bg-inigo-600 text-textDark rounded-3xl  text-sm px-3 py-1">
          {event.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-textDark  leading-tight">
          {event.name}
        </h1>
        <p className=" text-gray-600 dark:text-muted leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-white dark:bg-darkCard rounded-xl p-6 shadow-lg space-y-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-textDark mb-2">
          {t("eventDetails.eventDetails")}
        </h3>

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-muted">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-muted">
              {event.time}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-muted">
              {event.venue}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-darkCard rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xl text-gray-600 mb-1 flex items-center gap-2 dark:text-textDark">
              {t("eventDetails.ticketPrice")} :
              <span className=" font-bold text-blue-600">
                {event.price + t("currency")}
              </span>
            </p>
          </div>
        </div>

        {isBooked ? (
          <Button
            //   onClick={handleBookNow}
            className="w-full  text-white font-semibold text-lg py-2 rounded-xl transition-all duration-300 transform hover:scale-102"
          >
            {t("bookNow")} - {event.price + t("currency")}
          </Button>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-full bg-green-500 text-white font-semibold text-lg py-2 rounded-xl border border-green-300">
              ✓ Already Booked
            </div>
            <p className="text-sm text-gray-600 dark:text-muted">
              You have successfully booked this event!
            </p>
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="p-0 h-auto text-blue-600 underline"
            >
              Sign in
            </Button>{" "}
            to book this event
          </p>
        )}
      </div>
    </div>
  );
}

export default Details;
