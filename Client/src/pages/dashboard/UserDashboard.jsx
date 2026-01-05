import React, { useState } from "react";
import { Ticket, Calendar, Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - In real app, this comes from useUserBookings hook
  const allBookings = [
    {
      id: 1,
      eventName: "Summer Music Fest",
      date: "2025-12-30",
      status: "upcoming",
      price: "150",
    },
    {
      id: 2,
      eventName: "Art Gallery Opening",
      date: "2026-01-15",
      status: "upcoming",
      price: "50",
    },
    {
      id: 3,
      eventName: "Tech Conference 2024",
      date: "2024-11-20",
      status: "past",
      price: "300",
    },
    {
      id: 4,
      eventName: "Jazz Night",
      date: "2024-10-05",
      status: "attended",
      price: "80",
    },
  ];

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = booking.eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const upcomingCount = allBookings.filter(
    (b) => b.status === "upcoming"
  ).length;
  const attendedCount = allBookings.filter(
    (b) => b.status === "attended" || b.status === "past"
  ).length;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("management.dashboard")}
        </h1>
        <p className="text-muted-foreground font-medium">
          {t("management.overview")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border shadow-md bg-background transition-transform hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {t("userDashboard.upcomingBookings")}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ticket className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">
              {upcomingCount}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">
              {t("userDashboard.nextBooking")}:{" "}
              {upcomingCount > 0 ? filteredBookings[0]?.date : "None"}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-md bg-background transition-transform hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {t("userDashboard.eventsAttended")}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">
              {attendedCount}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">
              Totals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="border border-border shadow-lg bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("userDashboard.myTickets")}
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage your bookings and tickets
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("management.searchUsers")}
                  className="pl-8 bg-muted/50 border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-muted/50 border-border/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">
                      {booking.eventName}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground/70">
                      {booking.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {booking.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl font-bold border-border/60"
                    >
                      {t("userDashboard.viewTicket")}
                    </Button>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No bookings found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
