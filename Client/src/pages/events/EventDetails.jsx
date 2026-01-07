import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useEvent } from "@/hooks/useEvents";
import { useUserBookings } from "@/hooks/useTickets";
import { useAuthStore } from "@features/auth/store/authStore";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { motion } from "framer-motion";
import EventHero from "@features/events/components/EventHero";
import EventInfo from "@features/events/components/EventInfo";
import BookingCard from "@features/events/components/BookingCard";

const EventDetails = () => {
  const { t, i18n } = useTranslation();
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const id = paramId?.includes("eventId=")
    ? paramId.split("eventId=")[1]
    : paramId;

  const { data, isLoading, isError } = useEvent(id);
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: createBooking, isLoading: isBookingLoading } =
    useCreateBooking();

  const event = useMemo(() => {
    if (!data) return null;
    const rawEvent = data.normalEvent;
    const langEvent = i18n.language === "ar" ? data.arEvent : data.enEvent;

    return {
      ...rawEvent,
      ...langEvent,
      _id: rawEvent._id,
      image: rawEvent.image?.secure_url || rawEvent.image,
    };
  }, [data, i18n.language]);

  const { data: upcomingBookingsData } = useUserBookings("upcoming");
  const isBooked = useMemo(() => {
    return (
      upcomingBookingsData?.bookings?.some(
        (b) =>
          b.event?._id?.toString() === id.toString() && b.status === "booked"
      ) || false
    );
  }, [upcomingBookingsData, id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    createBooking(
      { eventId: id },
      {
        onSuccess: (data) => {
          if (data.url) {
            window.location.href = data.url;
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("errors.eventNotFound") || "Event Not Found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or an error occurred.
          </p>
          <Button variant="default" onClick={() => navigate("/events")}>
            {t("eventDetails.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <EventHero event={event} isBooked={isBooked} />

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-7xl mx-auto px-4 md:px-6 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <EventInfo event={event} />
          </div>

          {/* Booking Card - Right Side */}
          <div className="lg:col-span-1">
            <BookingCard
              event={event}
              isAuthenticated={isAuthenticated}
              isBooked={isBooked}
              onBook={handleBookNow}
              isBookingLoading={isBookingLoading}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
