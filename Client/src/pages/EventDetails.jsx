import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import { events } from "../lib/Events";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import Header from "../components/EventDetails/Header";
import Details from "../components/EventDetails/Details";

const EventDetails = () => {
  const { t, i18n } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const id = eventId.split("eventId=")[1];
  const isAuthenticated = true;
  const isBooked = true;
  const user = { role: "user" };

  const event = events.filter((event) => event.id === id)[0];

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  //   const isBooked = user?.bookedEvents.includes(event.id) || false;

  //   const handleBookNow = () => {
  //     if (!isAuthenticated) {
  //       navigate("/login");
  //       return;
  //     }

  //     bookEvent(event.id);
  //     navigate("/booking-success", { state: { event } });
  //   };

  return (
    <div className="min-h-screen bg-lightMainBg dark:bg-darkMainBg">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-40 lg:h-full object-cover rounded-2xl shadow-2xl"
            />
            {isBooked && (
              <span
                className={`absolute ${
                  i18n.language === "ar" ? "left-4 top-4" : "top-4 right-4"
                } bg-green-500 text-textDark rounded-xl  px-4 py-2`}
              >
                {t("eventDetails.booked")}
              </span>
            )}
          </div>
          <Details
            event={event}
            isAuthenticated={isAuthenticated}
            isBooked={isBooked}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
