import React from "react";
import { Banknote, CalendarClock, MapPin, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToggleWishlist } from "@/hooks/useTickets";
import { useAuthStore } from "@features/auth/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EventCard = ({ event }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const toggleWishlist = useToggleWishlist();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  const isInWishlist = user?.wishlist?.includes(event._id || event.id) || false;

  const handleGoToEvent = (event) => {
    navigate(`/events/${event._id || event.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    toggleWishlist.mutate(event._id || event.id);
  };

  return (
    <>
      <Card
        className="relative overflow-hidden group h-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
        key={event._id}
        onClick={() => handleGoToEvent(event)}
      >
        <span
          className={`absolute ${
            lang === "ar" ? "right-2 top-2" : "left-2 top-2"
          } bg-background  px-2  py-1 rounded z-10`}
        >
          {event.category || "General"}
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute z-10 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110",
            lang === "ar" ? "left-2 top-2" : "right-2 top-2",
            isInWishlist
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/90 dark:bg-black/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950"
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all",
              isInWishlist && "fill-current"
            )}
          />
        </button>

        <div className="flex flex-col h-full">
          <img
            src={event.image?.secure_url || event.image}
            alt={event.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <CardContent className="md:flex-2 flex flex-col gap-2 justify-between h-full py-5 px-3">
            <div className="flex flex-col gap-2 h-full">
              <h2 className="text-xl font-bold text-black dark:text-white line-clamp-2">
                {event.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                {event.description?.length > 60
                  ? event.description.slice(0, 100) + "..."
                  : event.description}
              </p>
              <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
                <CalendarClock className="w-4 h-4" />{" "}
                {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                {event.time && ` • ${event.time}`}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
                <MapPin className="w-4 h-4" /> {event.venue}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 gap-2 flex">
                <Banknote className="w-4 h-4" /> {event.price}{" "}
                {t("common.currency")}
              </span>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleGoToEvent(event);
              }}
              className={cn(
                "w-full mt-2 font-bold",
                event.status === "Cancelled" ||
                  event.status === "Sold Out" ||
                  event.availableTickets === 0
                  ? "bg-gray-400 text-white"
                  : "bg-primary text-white"
              )}
              disabled={
                event.status === "Cancelled" ||
                event.status === "Sold Out" ||
                event.availableTickets === 0
              }
              variant={event.status === "Cancelled" ? "destructive" : "default"}
            >
              {event.status === "Cancelled"
                ? t("dashboard.status.cancelled") || "Cancelled"
                : event.status === "Sold Out" || event.availableTickets === 0
                ? t("dashboard.status.soldOut") || "Sold Out"
                : t("buttons.bookNow")}
            </Button>
          </CardContent>
        </div>
      </Card>
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>{t("common.loginRequiredTitle")}</DialogTitle>
            <DialogDescription>
              {t("common.loginRequiredMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowLoginDialog(false);
              }}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}
            >
              {t("common.loginNow")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
