import React from "react";
import { Loader2, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const BookingCard = ({
  event,
  isBooked,
  onBook,
  isBookingLoading,
  isAuthenticated,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="sticky top-25 rounded-3xl p-2 shadow-md border-border mt-10 lg:mt-0">
      <CardHeader className="text-center lg:text-left pb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 text-start">
          {t("eventDetails.ticketPrice") || "Ticket Price"}
        </p>
        <div className="flex items-baseline justify-center lg:justify-start gap-2">
          <span className="text-5xl font-semibold text-black dark:text-white">
            {event.price}
          </span>
          <span className="text-lg font-bold text-gray-500 uppercase">
            {t("common.currency")}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        {/* Booking Button */}
        {!isBooked ? (
          <div className="space-y-6">
            <Button
              onClick={onBook}
              disabled={
                isBookingLoading ||
                event.status === "Cancelled" ||
                event.status === "Sold Out" ||
                event.availableTickets === 0
              }
              variant={event.status === "Cancelled" ? "destructive" : "default"}
              className={cn(
                "w-full h-12 rounded-2xl text-xl font-semibold shadow-sm text-white transform transition-all hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:opacity-70",
                event.status === "Cancelled" ||
                  event.status === "Sold Out" ||
                  event.availableTickets === 0
                  ? "bg-gray-400 text-white"
                  : "bg-primary text-white"
              )}
            >
              {isBookingLoading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : event.status === "Cancelled" ? (
                t("dashboard.status.cancelled") || "Cancelled"
              ) : event.status === "Sold Out" ||
                event.availableTickets === 0 ? (
                t("dashboard.status.soldOut") || "Sold Out"
              ) : (
                <>
                  <Tag className="w-6 h-6 mr-3" />
                  {t("buttons.bookNow") || "Book Now"}
                </>
              )}
            </Button>

            {!isAuthenticated &&
              event.status !== "Cancelled" &&
              event.status !== "Sold Out" &&
              event.availableTickets !== 0 && (
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
              {t("eventDetails.instantConfirmation") || "Instant confirmation"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
