import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  QrCode,
  TrendingUp,
  Sparkles,
  XCircle,
  Star,
  ChevronRight,
  Wallet,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useNextEvent, useUserBookings } from "@/hooks/useTickets";
import { useCancelTicket } from "@/hooks/useCancelTicket";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import QRCodeModal from "@/components/tickets/QRCodeModal";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyTickets() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const cancelTicket = useCancelTicket();

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[i18n.language] || field.en || "";
  };

  const handleShowQR = (booking) => {
    setSelectedBooking(booking);
    setQrModalOpen(true);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelTicket.mutate(bookingToCancel.event._id);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleGetDirections = (venue) => {
    const venueStr = getLocalized(venue);
    const encodedVenue = encodeURIComponent(venueStr);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedVenue}`,
      "_blank"
    );
  };

  // Fetch data
  const { data: nextEventData } = useNextEvent();
  const { data: upcomingData, isLoading: loadingUpcoming } =
    useUserBookings("upcoming");
  const { data: pastData, isLoading: loadingPast } = useUserBookings("past");
  const { data: cancelledData, isLoading: loadingCancelled } =
    useUserBookings("cancelled");

  const nextEvent = nextEventData?.booking;
  const upcomingBookings = upcomingData?.bookings || [];
  const pastBookings = pastData?.bookings || [];
  const cancelledBookings = cancelledData?.bookings || [];

  // Calculate time until next event
  const getTimeUntilEvent = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeUntil, setTimeUntil] = useState(
    nextEvent?.event?.date ? getTimeUntilEvent(nextEvent.event.date) : null
  );

  // Determine which event to show in the Hero
  const lastEvent = [...pastBookings].sort(
    (a, b) => new Date(b.event?.date) - new Date(a.event?.date)
  )[0];

  // Try to get the next event from the dedicated endpoint,
  // or fallback to the first event in the upcoming list (very useful if nextEvent hasn't refetched or filtered weirdly)
  const fallbackNextEvent = [...upcomingBookings].sort(
    (a, b) => new Date(a.event?.date) - new Date(b.event?.date)
  )[0];

  const heroEvent = nextEvent || fallbackNextEvent || lastEvent;
  const isHeroPast = !nextEvent && !fallbackNextEvent && lastEvent;

  // Auto-switch to past tab if no upcoming bookings
  React.useEffect(() => {
    if (
      !loadingUpcoming &&
      upcomingBookings.length === 0 &&
      pastBookings.length > 0
    ) {
      setActiveTab("past");
    }
  }, [loadingUpcoming, upcomingBookings.length, pastBookings.length]);

  React.useEffect(() => {
    if (!heroEvent?.event?.date || isHeroPast) return;

    // Initial calculation
    setTimeUntil(getTimeUntilEvent(heroEvent.event.date));

    // Update every second
    const timer = setInterval(() => {
      setTimeUntil(getTimeUntilEvent(heroEvent.event.date));
    }, 1000);

    return () => clearInterval(timer);
  }, [heroEvent?.event?.date, isHeroPast]);

  return (
    <div className="min-h-screen p-4 md:p-1 relative">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header & Stats Container */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                  {t("dashboard.overview") || "User Dashboard"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-neutral-50 lowercase first-letter:uppercase">
                {t("tickets.myTickets")}
              </h1>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex flex-col px-4 py-1 border-e border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {t("tickets.upcoming") || "Upcoming"}
                </span>
                <span className="text-xl font-black text-primary">
                  {upcomingBookings.length}
                </span>
              </div>
              <div className="flex flex-col px-4 py-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {t("tickets.past") || "Past"}
                </span>
                <span className="text-xl font-black text-neutral-400">
                  {pastBookings.length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Event Hero */}
        {/* Premium Cinematic Hero (Next Event or Last Memory) */}
        <AnimatePresence mode="wait">
          {heroEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative group"
            >
              <Card
                className={cn(
                  "relative h-[380px] md:h-[420px] overflow-hidden border-none shadow-2xl rounded-[2.5rem] ticket-hero-mask transition-all duration-700 group/hero",
                  "bg-neutral-900",
                  isHeroPast ? "grayscale" : ""
                )}
              >
                {/* Full Bleed Background Image */}
                <div className="absolute inset-0 z-0">
                  {heroEvent.event.image?.secure_url ? (
                    <>
                      <img
                        src={heroEvent.event.image.secure_url}
                        className="w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover/hero:scale-110"
                        alt=""
                      />
                      {/* Depth Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-neutral-800" />
                  )}
                </div>

                <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left Section: Immersive Info */}
                  <div className="lg:col-span-8 p-8 md:p-14 flex flex-col justify-between items-start">
                    <div className="space-y-8 w-full">
                      {/* Floating Badge */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={cn(
                          "inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-2xl border shadow-2xl",
                          isHeroPast
                            ? "bg-white/5 border-white/10 text-white/60"
                            : heroEvent.paymentStatus === "pending"
                            ? "bg-amber-500/20 border-amber-500/30 text-amber-500"
                            : "bg-primary/20 border-primary/30 text-white"
                        )}
                      >
                        {isHeroPast ? (
                          <Star className="h-3.5 w-3.5" />
                        ) : heroEvent.paymentStatus === "pending" ? (
                          <Clock className="h-3.5 w-3.5" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        {isHeroPast
                          ? t("tickets.sweetMemories")
                          : heroEvent.paymentStatus === "pending"
                          ? t("dashboard.status.pending")
                          : t("tickets.nextEvent")}
                      </motion.div>

                      {/* Title & Meta */}
                      <div className="space-y-4 max-w-2xl">
                        <motion.h2
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
                        >
                          {getLocalized(heroEvent.event.name)}
                        </motion.h2>

                        <div className="flex flex-wrap items-center gap-8">
                          <div className="flex items-center gap-4 text-white font-black tracking-tight border-none outline-none">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/80 to-primary border border-white/20 flex items-center justify-center shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] rotate-[-3deg] shrink-0">
                              <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">
                                {t("hero.date")}
                              </span>
                              <span className="text-sm">
                                {new Date(
                                  heroEvent.event.date
                                ).toLocaleDateString(i18n.language, {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-white font-black tracking-tight border-none outline-none">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/80 to-primary border border-white/20 flex items-center justify-center shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] rotate-[3deg] shrink-0">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">
                                {t("hero.venue")}
                              </span>
                              <span className="text-sm truncate max-w-[200px]">
                                {getLocalized(heroEvent.event.venue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Actions */}
                    <div className="mt-12 flex flex-wrap gap-4 w-full">
                      <Button
                        size="xl"
                        className={cn(
                          "rounded-2xl px-12 h-16 font-black text-base shadow-2xl transition-all hover:translate-y-[-2px] active:scale-95 group",
                          isHeroPast
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-primary text-white hover:bg-primary/90"
                        )}
                        onClick={() =>
                          isHeroPast
                            ? navigate(`/user/tickets/${heroEvent._id}`)
                            : handleShowQR(heroEvent)
                        }
                      >
                        {isHeroPast ? (
                          <Activity className="h-5 w-5 mr-3" />
                        ) : (
                          <QrCode className="h-5 w-5 mr-3" />
                        )}
                        {isHeroPast
                          ? t("buttons.viewRecap")
                          : t("hero.showTicket")}
                        {!isHeroPast && (
                          <div className="ml-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        )}
                      </Button>

                      {!isHeroPast && (
                        <Button
                          size="xl"
                          variant="ghost"
                          className="rounded-2xl px-8 h-16 bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 backdrop-blur-xl transition-all shadow-xl"
                          onClick={() =>
                            handleGetDirections(heroEvent.event.venue)
                          }
                        >
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Right Section: The Glass Stub */}
                  <div className="hidden lg:flex lg:col-span-4 relative bg-black/40 backdrop-blur-xl p-10 flex-col items-center justify-center border-l border-white/10 group-hover/hero:bg-black/60 transition-colors duration-500">
                    {/* Perforation Simulation */}
                    <div className="absolute left-[-1.5px] top-6 bottom-6 border-l-2 border-dashed border-white/20 z-20 pointer-events-none" />

                    {!isHeroPast ? (
                      <div className="space-y-10 w-full flex flex-col items-center">
                        <div className="text-center space-y-4">
                          <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">
                            {t("hero.startsIn")}
                          </p>
                          <div className="flex gap-3">
                            {[
                              {
                                val: timeUntil?.days || 0,
                                label: t("time.days"),
                              },
                              {
                                val: timeUntil?.hours || 0,
                                label: t("time.hrs"),
                              },
                            ].map((item, id) => (
                              <div
                                key={id}
                                className="relative w-20 h-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shadow-2xl"
                              >
                                <span className="text-4xl font-black text-white tracking-tighter">
                                  {item.val}
                                </span>
                                <span className="text-[8px] font-black text-white/40 uppercase mt-1">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive QR Preview */}
                        <motion.div
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative p-7 rounded-[2rem] bg-white text-black shadow-2xl cursor-pointer overflow-hidden group/qr-btn"
                          onClick={() => handleShowQR(heroEvent)}
                        >
                          <QrCode className="w-16 h-16 opacity-100" />
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/qr-btn:opacity-100 transition-opacity" />
                        </motion.div>

                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                          {t("hero.tapToScan") || "TAP TO SCAN"}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-6">
                        <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group/star">
                          <Star className="h-12 w-12 text-white/60 group-hover/star:scale-110 group-hover/star:text-primary transition-all duration-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">
                            {t("tickets.completed")}
                          </p>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                            {t("tickets.experience")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-16 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
            <div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">
                {t("dashboard.tabs.title") || "Ticket Inventory"}
              </h3>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {t("dashboard.tabs.description") ||
                  "Manage your event access and history"}
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1 rounded-xl border border-black/5 dark:border-white/5">
                <TabsTrigger
                  value="upcoming"
                  className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm"
                >
                  {t("dashboard.tabs.upcoming")}
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm"
                >
                  {t("dashboard.tabs.past")}
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm"
                >
                  {t("dashboard.tabs.cancelled")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <TabsContent
                key={activeTab}
                value={activeTab}
                forceMount
                className="mt-0 focus-visible:outline-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  {activeTab === "upcoming" &&
                    (loadingUpcoming ? (
                      <LoadingPlaceholder />
                    ) : upcomingBookings.length === 0 ? (
                      <EmptyTicketsState message={t("tickets.noUpcoming")} />
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking, idx) => (
                          <TicketCard
                            key={booking._id}
                            booking={booking}
                            onShowQR={handleShowQR}
                            onCancel={handleCancelClick}
                            getLocalized={getLocalized}
                            i18n={i18n}
                            t={t}
                            index={idx}
                          />
                        ))}
                      </div>
                    ))}

                  {activeTab === "past" &&
                    (loadingPast ? (
                      <LoadingPlaceholder />
                    ) : pastBookings.length === 0 ? (
                      <EmptyTicketsState message={t("tickets.noPast")} />
                    ) : (
                      <div className="space-y-4">
                        {pastBookings.map((booking, idx) => (
                          <TicketCard
                            key={booking._id}
                            booking={booking}
                            isPast
                            onShowQR={handleShowQR}
                            getLocalized={getLocalized}
                            i18n={i18n}
                            t={t}
                            index={idx}
                          />
                        ))}
                      </div>
                    ))}

                  {activeTab === "cancelled" &&
                    (loadingCancelled ? (
                      <LoadingPlaceholder />
                    ) : cancelledBookings.length === 0 ? (
                      <EmptyTicketsState message={t("tickets.noCancelled")} />
                    ) : (
                      <div className="space-y-4">
                        {cancelledBookings.map((booking, idx) => (
                          <TicketCard
                            key={booking._id}
                            booking={booking}
                            isCancelled
                            getLocalized={getLocalized}
                            i18n={i18n}
                            t={t}
                            index={idx}
                          />
                        ))}
                      </div>
                    ))}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
        <QRCodeModal
          booking={selectedBooking}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />

        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("tickets.cancelTitle") || "Cancel Ticket?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("tickets.cancelDesc") ||
                  "Are you sure you want to cancel this ticket? A refund will be processed to your original payment method. This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("buttons.cancel") || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("tickets.confirmCancel") || "Yes, Cancel Ticket"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// Helper Components
function LoadingPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 rounded-[2rem] bg-neutral-200 dark:bg-neutral-800 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyTicketsState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-dashed border-border/60">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Ticket className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
        {message}
      </p>
    </div>
  );
}

// Ticket Card Component - Horizontal Full-Width Design
function TicketCard({
  booking,
  isPast,
  isCancelled,
  onShowQR,
  onCancel,
  getLocalized,
  i18n,
  t,
  index,
}) {
  const navigate = useNavigate();
  const safeGetLocalized =
    getLocalized ||
    ((f) => (typeof f === "string" ? f : f?.[i18n?.language] || f?.en || ""));

  const handleCardClick = () => {
    if (booking?._id) {
      navigate(`/user/tickets/${booking._id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group relative"
    >
      <Card
        className="overflow-hidden bg-white dark:bg-neutral-900 border border-border/40 hover:border-primary/40 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left: Image Section */}
          <div className="relative md:w-80 h-48 md:h-auto overflow-hidden shrink-0">
            {booking.event?.image?.secure_url ? (
              <img
                src={booking.event.image.secure_url}
                alt={safeGetLocalized(booking.event.name)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800" />
            )}

            {/* Date Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex flex-col items-center min-w-[60px]">
              <span className="text-2xl font-black leading-none">
                {new Date(booking.event?.date).getDate()}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest mt-1">
                {new Date(booking.event?.date).toLocaleDateString(
                  i18n.language,
                  { month: "short" }
                )}
              </span>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isCancelled || booking.event?.status === "Cancelled" ? (
                <Badge className="bg-destructive/10 text-destructive border-none font-black text-[10px] lowercase first-letter:uppercase backdrop-blur-md">
                  {t("dashboard.status.cancelled")}
                </Badge>
              ) : isPast ? (
                <Badge className="bg-neutral-800/80 text-white border-none font-black text-[10px] lowercase first-letter:uppercase backdrop-blur-md">
                  {t("dashboard.status.past") || "Past"}
                </Badge>
              ) : booking.paymentStatus === "pending" ? (
                <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[10px] lowercase first-letter:uppercase backdrop-blur-md">
                  {t("dashboard.status.pending") || "Pending"}
                </Badge>
              ) : (
                <Badge className="bg-green-600 hover:bg-green-600/80 text-white border-none font-bold text-md lowercase first-letter:uppercase shadow-lg shadow-primary/40">
                  {t("dashboard.status.active") || "Active"}
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Event Title */}
              <h3 className="font-black text-2xl tracking-tight text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-primary transition-colors">
                {safeGetLocalized(booking.event?.name)}
              </h3>

              {/* Event Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-bold uppercase tracking-wide text-xs">
                    {safeGetLocalized(booking.event?.venue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-bold text-xs">
                    {new Date(booking.event?.date).toLocaleDateString(
                      i18n.language,
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-xs">
                  {booking.event?.price} {t("dashboard.currency")}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-border/40">
              {/* Booking Info */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border/40">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                    #{booking._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                {booking.event?.category && (
                  <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-xs font-bold text-primary whitespace-nowrap">
                      {safeGetLocalized(booking.event.category.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              {!(isCancelled || booking.event?.status === "Cancelled") && (
                <div className="flex flex-wrap gap-2">
                  {onShowQR && (
                    <Button
                      className="rounded-2xl font-bold text-xs py-4 px-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 hover:opacity-90 transition-all active:scale-95 group/btn shadow-sm whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowQR(booking);
                      }}
                    >
                      <QrCode className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-12" />
                      {t("buttons.showTicket")}
                    </Button>
                  )}
                  {!isPast && onCancel && (
                    <Button
                      variant="ghost"
                      className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl font-black text-xs py-3 px-5 text-destructive hover:bg-destructive/10 transition-all active:scale-95 whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(booking);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {t("buttons.cancel")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
