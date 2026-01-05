import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const EventHero = ({ event, isBooked }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  return (
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
              className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 hover:text-white border-white/20 px-8 h-12 md:h-14"
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
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
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
  );
};

export default EventHero;
