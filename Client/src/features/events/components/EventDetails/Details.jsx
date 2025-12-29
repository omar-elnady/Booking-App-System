import { Calendar, Clock, MapPin, Loader2, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function Details({
  event,
  isAuthenticated,
  isBooked,
  onBook,
  isBookingLoading,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-10">
        {/* Description Card */}
        <Card className="rounded-3xl border-gray-100 dark:border-white/10 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              {t("eventDetails.about") || "About This Event"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {event.description}
            </p>
          </CardContent>
        </Card>

        {/* Event Details Card */}
        <Card className="rounded-3xl border-gray-100 dark:border-white/10 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-black">
              {t("eventDetails.eventDetails") || "Event Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
                <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                  <Calendar className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    {t("eventDetails.date") || "Date"}
                  </p>
                  <p className="font-bold text-black dark:text-white">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "TBA"}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
                <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                  <Clock className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    {t("eventDetails.time") || "Time"}
                  </p>
                  <p className="font-bold text-black dark:text-white">
                    {event.time || "TBA"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5 sm:col-span-2">
                <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                  <MapPin className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    {t("eventDetails.venue") || "Venue"}
                  </p>
                  <p className="font-bold text-black dark:text-white">
                    {event.venue}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Card - Right Side (Sticky) */}
      <div className="lg:col-span-1">
        <Card className="sticky top-25 rounded-3xl p-2 shadow-2xl border-gray-100 dark:border-white/10 mt-10 lg:mt-0">
          <CardHeader className="text-center lg:text-left pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 text-start">
              {t("eventDetails.ticketPrice") || "Ticket Price"}
            </p>
            <div className="flex items-baseline justify-center lg:justify-start gap-2">
              <span className="text-5xl font-semibold text-black dark:text-white">
                {event.price}
              </span>
              <span className="text-lg font-bold text-gray-500 uppercase">
                {t("currency")}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Booking Button */}
            {!isBooked ? (
              <div className="space-y-6">
                <Button
                  onClick={onBook}
                  disabled={isBookingLoading}
                  className="w-full h-12 rounded-2xl text-xl font-semibold shadow-xl transform transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isBookingLoading ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <Tag className="w-6 h-6 mr-3" />
                      {t("bookNow") || "Book Now"}
                    </>
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-center text-gray-500">
                    <button
                      onClick={() => navigate("/login")}
                      className="text-black dark:text-white font-bold hover:underline"
                    >
                      {t("login.signIn") || "Sign in"}
                    </button>{" "}
                    {t("eventDetails.toBook") || "to book this event"}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-black dark:bg-white text-white dark:text-black font-black text-xl py-5 rounded-2xl text-center shadow-lg">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      {t("eventDetails.alreadyBooked") || "Already Booked"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-500 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                  {t("eventDetails.bookSuccessMessage") ||
                    "You have successfully booked this event!"}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border dark:border-white/10">
                  <Users className="w-5 h-5" />
                </div>
                <span>
                  {t("eventDetails.limitedSeats") || "Limited seats available"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border dark:border-white/10">
                  <Tag className="w-5 h-5" />
                </div>
                <span>
                  {t("eventDetails.instantConfirmation") ||
                    "Instant confirmation"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Details;
