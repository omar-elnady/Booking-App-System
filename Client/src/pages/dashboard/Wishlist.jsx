import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Calendar,
  MapPin,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  useWishlist,
  useToggleWishlist,
  useUserBookings,
} from "@/hooks/useTickets";
import { AnimatePresence, motion } from "framer-motion";

export default function Wishlist() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: wishlistData, isLoading } = useWishlist();
  const { data: bookingsData } = useUserBookings("upcoming");
  const toggleWishlist = useToggleWishlist();

  const wishlist = wishlistData?.wishlist || [];

  const handleRemove = (eventId) => {
    toggleWishlist.mutate(eventId);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[i18n.language] || field.en || "";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-1 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 dark:border-neutral-800 pb-10"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                {t("wishlist.tag") || "Personal Collection"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight lowercase first-letter:uppercase">
              {t("wishlist.title") || "My Wishlist"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-lg font-normal leading-relaxed mt-2">
              {t("wishlist.subtitle") ||
                "A curated list of events you've handpicked for your next adventure."}
            </p>
          </div>

          <div className="relative group">
            <div className="relative flex items-center gap-4 bg-white dark:bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {t("wishlist.total") || "Collection"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">
                  {wishlist.length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="h-5 w-5 fill-current" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-neutral-400 font-medium text-xs uppercase tracking-[0.2em] animate-pulse">
              {t("common.loading") || "Refining your list..."}
            </p>
          </div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center max-w-sm w-full p-10 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="w-24 h-24 mx-auto rounded-[2rem] bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                <Heart className="h-10 w-10 text-neutral-200 dark:text-neutral-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white leading-none">
                  {t("wishlist.empty") || "Empty Dreams"}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                  {t("wishlist.emptyDesc") ||
                    "Your wishlist is currently a blank canvas."}
                </p>
              </div>
              <Button
                onClick={() => navigate("/events")}
                className="w-full h-14 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 font-bold text-base transition-all active:scale-95 shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t("buttons.browseEvents") || "Explore Events"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  layout
                  className="h-full"
                >
                  {(() => {
                    const statusStr = event.status?.toLowerCase() || "";
                    const isCancelled =
                      statusStr === "cancelled" || event.isCancelled === true;
                    const isSoldOut =
                      (event.availableTickets || 0) <= 0 ||
                      statusStr === "sold out" ||
                      event.isSoldOut === true;
                    const isBooked = bookingsData?.bookings?.some(
                      (b) => b.event?._id === event._id || b.event === event._id
                    );
                    const isUnavailable = isCancelled || isSoldOut;

                    return (
                      <Card
                        className={`group h-full flex flex-col relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 transition-all duration-500 rounded-[2.5rem] shadow-sm hover:shadow-xl ${
                          isUnavailable
                            ? "opacity-75 grayscale-[0.5]"
                            : "hover:border-primary/20"
                        }`}
                      >
                        {/* Image Header */}
                        <div className="relative aspect-[16/11] overflow-hidden">
                          {event.image?.secure_url ? (
                            <img
                              src={event.image.secure_url}
                              alt={getLocalized(event.name)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                              <MapPin className="h-10 w-10 text-neutral-300" />
                            </div>
                          )}

                          {/* Overlays */}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                          {/* Status Badges Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {isCancelled ? (
                              <div className="px-6 py-2 bg-destructive/90 backdrop-blur-md text-white text-sm font-bold uppercase tracking-[0.3em] rounded-full shadow-2xl rotate-[-10deg] border border-white/20">
                                {t("dashboard.status.cancelled") || "Cancelled"}
                              </div>
                            ) : isSoldOut ? (
                              <div className="px-6 py-2 bg-neutral-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-neutral-900 text-sm font-bold uppercase tracking-[0.3em] rounded-full shadow-2xl border border-neutral-200/20">
                                {t("dashboard.status.soldout") || "Sold Out"}
                              </div>
                            ) : null}
                          </div>

                          {/* Ticket Stub Style Date Badge (Refined) */}
                          <div className="absolute top-5 left-5 flex flex-col items-center justify-center w-14 h-16 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
                            <div className="w-full bg-primary/95 py-0.5 px-1 text-center">
                              <span className="text-[9px] font-bold text-primary-foreground uppercase tracking-widest leading-none">
                                {new Date(event.date).toLocaleDateString(
                                  i18n.language,
                                  { month: "short" }
                                )}
                              </span>
                            </div>
                            <div className="flex-1 flex items-center justify-center flex-col">
                              <span className="text-xl font-bold text-neutral-900 dark:text-white leading-none">
                                {new Date(event.date).getDate()}
                              </span>
                              <span className="text-[8px] font-semibold text-neutral-400 uppercase">
                                {new Date(event.date).toLocaleDateString(
                                  i18n.language,
                                  { weekday: "short" }
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-400 hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-90"
                            onClick={() => handleRemove(event._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          {/* Bottom Image Info (Low Stock only) */}
                          {!isUnavailable &&
                            event.availableTickets > 0 &&
                            event.availableTickets < 10 && (
                              <div className="absolute bottom-5 left-5">
                                <div className="px-2.5 py-1 rounded-lg bg-destructive text-white text-[9px] font-bold uppercase tracking-tight shadow-lg border border-white/10">
                                  {t("event.lowStock") || "Limited"}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-7 flex flex-col flex-1 gap-5">
                          <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight line-clamp-2 min-h-[3rem]">
                                {getLocalized(event.name)}
                              </h3>
                              {event.category?.name && (
                                <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                  {getLocalized(event.category.name)}
                                </div>
                              )}
                            </div>

                            {/* Clear Event Info */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                  <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                                    {t("hero.date") || "Date"}
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {new Date(event.date).toLocaleDateString(
                                      i18n.language,
                                      {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                  <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                                    {t("hero.venue") || "Location"}
                                  </span>
                                  <span className="text-sm font-semibold line-clamp-1">
                                    {getLocalized(event.venue)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer: Price & Primary Action */}
                          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
                                {t("event.price") || "Price"}
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                                  {event.price}
                                </span>
                                <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                                  {t("dashboard.currency")}
                                </span>
                              </div>
                            </div>

                            <Button
                              disabled={isUnavailable || isBooked}
                              onClick={() => handleViewEvent(event._id)}
                              className={`h-12 px-6 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg group/btn ${
                                isUnavailable
                                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-neutral-200 dark:border-neutral-800 shadow-none"
                                  : isBooked
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 shadow-none"
                                  : "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                              }`}
                            >
                              {isCancelled
                                ? t("dashboard.status.cancelled")
                                : isSoldOut
                                ? t("dashboard.status.soldout")
                                : isBooked
                                ? t("status.booked") || "Booked"
                                : t("buttons.bookNow") || "Book Now"}
                              {!isUnavailable && !isBooked && (
                                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                              )}
                              {isBooked && (
                                <div className="ml-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="3"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
