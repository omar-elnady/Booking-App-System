import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2, ArrowLeft, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Details from "@features/events/components/EventDetails/Details";
import { useEvent } from "@/hooks/useEvents";
import { useAuthStore } from "@features/auth/store/authStore";
import { useCreateBooking } from "@/hooks/useCreateBooking";

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

  const isBooked = user?.bookedEvents?.includes(id) || false;

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

  const handleShare = async () => {
    const eventUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success(
        t("eventDetails.linkCopied") || "Link copied to clipboard!"
      );
    } catch {
      toast.error(t("eventDetails.copyFailed") || "Failed to copy link");
    }
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
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute top-8 left-0 right-0 z-10 p-6 md:p-16 text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/events")}
                className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 border-white/20 px-8 h-12 md:h-14"
              >
                <ArrowLeft
                  className={`w-5 h-5 ${
                    i18n.language === "ar" ? "rotate-180 ml-2" : "mr-2"
                  }`}
                />
                <span className="font-bold">
                  {t("eventDetails.back") || "Back"}
                </span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 border-white/20 w-12 h-12 md:w-14 md:h-14"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Event Title & Category */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-full text-sm font-bold mb-4 border border-black/10 dark:border-white/10"
            >
              {event.category || "General"}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
            >
              {event.name}
            </motion.h1>
            {isBooked && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold shadow-lg"
              >
                <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                {t("eventDetails.booked") || "Booked"}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-7xl mx-auto px-4 md:px-6 py-12"
      >
        <Details
          event={event}
          isAuthenticated={isAuthenticated}
          isBooked={isBooked}
          onBook={handleBookNow}
          isBookingLoading={isBookingLoading}
        />
      </motion.div>
    </div>
  );
};

export default EventDetails;
