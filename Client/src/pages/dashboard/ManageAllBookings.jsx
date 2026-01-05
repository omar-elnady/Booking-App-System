import React, { useState } from "react";
import { useAdminBookings } from "@/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Activity, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { downloadCSV } from "@/lib/csvExport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROLES } from "@/lib/roles";
import EmptyState from "@/components/common/EmptyState";

export default function ManageAllBookings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useAdminBookings();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const bookings = data?.bookings || [];

  const filteredBookings = bookings.filter((b) => {
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
      // Skip role filtering, continue to search/status filters
    } else if (user?.role === ROLES.ORGANIZER) {
      // Organizer sees bookings only for their events
      const organizerId = b.event?.organizerId?._id || b.event?.organizerId;
      const createdBy = b.event?.createdBy?._id || b.event?.createdBy;

      const isOwnEvent = organizerId === user?._id || createdBy === user?._id;

      if (!isOwnEvent) return false;
    } else if (user?.role === ROLES.USER) {
      // User sees only their bookings
      if (b.user?._id !== user?._id) return false;
    } else {
      // Unknown role, show nothing
      return false;
    }

    const matchesSearch =
      b._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.event?.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.event?.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      bookingStatusFilter === "all" ||
      b.status?.toLowerCase() === bookingStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const csvData = filteredBookings.map((b) => ({
      OrderID: b._id,
      Customer: b.user?.userName,
      Email: b.user?.email,
      Event: b.event?.name?.en,
      Price: b.event?.price,
      PaymentStatus: b.paymentStatus,
      OrderStatus: b.status,
      Date: new Date(b.createdAt).toLocaleDateString(),
    }));
    downloadCSV(
      csvData,
      `bookings_report_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setBookingStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("management.bookings")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("management.bookingsSubtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="font-bold gap-2 rounded-xl border-border/60"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> {t("management.downloadReport")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            className="pl-11 h-11 border border-border/60 bg-background shadow-sm rounded-xl"
            placeholder={t("management.searchUsers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={bookingStatusFilter}
            onValueChange={setBookingStatusFilter}
          >
            <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-xl font-bold border-border/60 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 opacity-50" />
                <SelectValue placeholder={t("management.status")} />
              </div>
            </SelectTrigger>
            <SelectContent className="z-[100] rounded-xl">
              <SelectItem value="all" className="font-bold">
                {t("common.allStatuses") || "All Statuses"}
              </SelectItem>
              <SelectItem value="booked" className="font-bold">
                {t("dashboard.status.booked")}
              </SelectItem>
              <SelectItem value="pending" className="font-bold">
                {t("dashboard.status.pending")}
              </SelectItem>
              <SelectItem value="cancelled" className="font-bold">
                {t("dashboard.status.cancelled")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="font-bold text-foreground/80">
                {t("management.bookingId")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.customer")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.eventName")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.price")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.payment")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.status")}
              </TableHead>
              <TableHead className="text-right font-bold text-foreground/80">
                {t("management.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="hover:bg-muted/10 transition-colors border-border/40"
                >
                  <TableCell className="font-mono text-[10px] text-muted-foreground/60 font-bold">
                    #{booking._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight text-foreground/90">
                        {booking.user?.userName}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 font-medium">
                        {booking.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight text-foreground/90">
                        {i18n.language === "ar"
                          ? booking.event?.name?.ar
                          : booking.event?.name?.en}
                      </span>
                      <span className="text-[10px] bg-muted/50 w-fit px-1.5 py-0.5 rounded font-bold uppercase text-muted-foreground/70 border border-border/40">
                        {i18n.language === "ar"
                          ? booking.category?.name?.ar
                          : booking.category?.name?.en}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-sm text-foreground/80">
                    {booking.event?.price} {t("dashboard.currency")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-md border shadow-none",
                        booking.paymentStatus === "completed"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : booking.paymentStatus === "pending"
                          ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                      )}
                    >
                      {t(`dashboard.status.${booking.paymentStatus}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="font-bold uppercase text-[10px] rounded-md bg-muted/50 text-muted-foreground/80 border border-border/40"
                    >
                      {t(`dashboard.status.${booking.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted/40 rounded-lg text-muted-foreground/60"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-[450px] text-center border-none"
                >
                  <EmptyState
                    title={t("common.noResults")}
                    description={t("common.noResultsDesc")}
                    action={
                      <Button
                        variant="outline"
                        className="font-bold rounded-xl mt-4 px-8 h-11 shadow-sm border-border/60 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                        onClick={handleReset}
                      >
                        {t("common.clearAllFilters")}
                      </Button>
                    }
                    className="h-full border-none shadow-none bg-transparent"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-md rounded-2xl border-border/60 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-border/40 bg-muted/10">
            <DialogTitle className="font-bold text-xl">
              {t("management.bookingDetails") || "Booking Details"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t("tables.bookingId")}: #{selectedBooking?._id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-1 p-6">
              {[
                {
                  label: t("tables.customer"),
                  value: selectedBooking.user
                    ? selectedBooking.user.firstName &&
                      selectedBooking.user.lastName
                      ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                      : selectedBooking.user.userName
                    : "N/A",
                },
                {
                  label: t("management.email"),
                  value: selectedBooking.user?.email || "N/A",
                },
                {
                  label: t("tables.event"),
                  value:
                    i18n.language === "ar"
                      ? selectedBooking.event?.name?.ar
                      : selectedBooking.event?.name?.en,
                },
                {
                  label: t("tables.price"),
                  value: `${
                    selectedBooking.event?.price ||
                    selectedBooking.totalPrice ||
                    0
                  } ${t("dashboard.currency")}`,
                  highlight: true,
                },
                {
                  label: t("tables.date"),
                  value: new Date(
                    selectedBooking.createdAt ||
                      selectedBooking.date ||
                      Date.now()
                  ).toLocaleString(i18n.language),
                },
                {
                  label: t("tables.status"),
                  value:
                    t(`dashboard.status.${selectedBooking.status}`) ||
                    selectedBooking.status,
                  badge: true,
                  variant:
                    selectedBooking.status === "confirmed"
                      ? "success"
                      : "secondary",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-border/40 last:border-0"
                >
                  <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tight">
                    {row.label}
                  </span>
                  {row.badge ? (
                    <Badge variant="outline" className="font-bold">
                      {row.value}
                    </Badge>
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-bold",
                        row.highlight
                          ? "text-primary text-base"
                          : "text-foreground/90"
                      )}
                    >
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tight">
                  {t("tables.payment")}
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-bold uppercase text-[10px] rounded-md border shadow-none",
                    selectedBooking.paymentStatus === "completed"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : selectedBooking.paymentStatus === "pending"
                      ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                  )}
                >
                  {t(`dashboard.status.${selectedBooking.paymentStatus}`)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
