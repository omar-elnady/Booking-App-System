import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import { Button } from '@/components/ui/button';
// import { span } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import { events } from "../lib/Events";
// import { useEvents } from '../contexts/EventContext';
// import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const id = eventId.split("eventId=")[1];
  //   const { getEventById } = useEvents();
  //   const { user, isAuthenticated, bookEvent } = useAuth();
  const isAuthenticated = true;
  const isBooked = true;
  const user = { role: "user" };

  console.log(id);
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
    <div className=" bg-lightMainBg dark:bg-darkMainBg">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-40 lg:h-full object-cover rounded-2xl shadow-2xl"
            />
            {isBooked && (
              <span className="absolute top-4 right-4 bg-green-500 text-textDark rounded-xl  px-4 py-2">
                Already Booked
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2 flex flex-col items-start">
              <span className=" bg-indigo-600 hover:bg-inigo-600 text-textDark rounded-3xl  text-sm px-3 py-1">
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
                Event Details
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
                    Ticket Price :
                    <span className=" font-bold text-blue-600">
                      ${event.price}
                    </span>
                  </p>
                </div>
              </div>

              {!isBooked ? (
                <Button
                  //   onClick={handleBookNow}
                  className="w-full  text-white font-semibold text-lg py-2 rounded-xl transition-all duration-300 transform hover:scale-102"
                >
                  Book Now - ${event.price}
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
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
