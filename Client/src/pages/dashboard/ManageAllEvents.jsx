import React, { useState } from "react";
import {
  useAdminEvents,
  useUpdateEventStatus,
  useDeleteEvent,
  useCreateEvent,
  useUpdateEvent,
} from "@/hooks/useAdmin";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROLES } from "@/lib/roles";
import EventsTable from "@features/dashboards/components/events/EventsTable";
import EventFormModal from "@features/dashboards/components/events/EventFormModal";
import DeleteEventModal from "@features/dashboards/components/events/DeleteEventModal";

export default function ManageAllEvents() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useAdminEvents();
  const { data: categoriesData } = useCategories("", 100);
  const categories =
    categoriesData?.pages?.flatMap((page) => page.categories) || [];
  const updateEventStatus = useUpdateEventStatus();
  const deleteEvent = useDeleteEvent();
  const createEvent = useCreateEvent();
  const createCategory = useCreateCategory();
  const updateEvent = useUpdateEvent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const events = data?.events || [];

  // Filter events based on role, search, status, and category
  const filteredEvents = events.filter((event) => {
    // 1. Role Check
    let roleMatch = false;
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
      roleMatch = true;
    } else if (user?.role === ROLES.ORGANIZER) {
      roleMatch =
        event.createdBy?._id === user?._id ||
        event.organizerId === user?._id ||
        event.createdBy === user?._id;
    }
    if (!roleMatch) return false;

    // 2. Search
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      event.name?.en?.toLowerCase().includes(lowerSearch) ||
      event.name?.ar?.toLowerCase().includes(lowerSearch) ||
      event.venue?.en?.toLowerCase().includes(lowerSearch) ||
      event.venue?.ar?.toLowerCase().includes(lowerSearch);

    // 3. Status Filter
    const matchesStatus =
      statusFilter === "all" ||
      event.status?.toLowerCase() === statusFilter.toLowerCase();

    // 4. Category Filter
    const matchesCategory =
      categoryFilter === "all" || event.category?._id === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (event, status) => {
    if (event.status.toLowerCase() === status.toLowerCase()) {
      return toast.info(
        `${t("management.event")} ${
          i18n.language === "ar" ? event.name?.ar : event.name?.en
        } ${t("management.alreadyIs")} ${t(
          `dashboard.status.${status.toLowerCase()}`
        )}`
      );
    }
    updateEventStatus.mutate({ eventId: event._id, status });
  };

  // ... existing handlers ...

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteEvent.mutate(selectedEvent._id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedEvent(null);
        },
      });
    }
  };

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedEvent && isFormOpen) {
      updateEvent.mutate(
        { eventId: selectedEvent._id, formData },
        {
          onSuccess: () => setIsFormOpen(false),
        }
      );
    } else {
      createEvent.mutate(formData, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("management.manageEvents")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("management.eventsSubtitle")}
          </p>
        </div>
        <Button
          className="font-semibold gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground shadow-md hover:shadow-lg active:scale-95 transition-all"
          onClick={handleOpenCreate}
        >
          <Plus className="h-5 w-5" /> {t("manageEvents.addNew")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            className="pl-11 h-11 border border-border/60 bg-background shadow-sm rounded-xl"
            placeholder={t("management.searchBookings") || t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-xl font-bold border-border/60 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 opacity-50" />
                <SelectValue placeholder={t("buttons.categoryLabel")} />
              </div>
            </SelectTrigger>
            <SelectContent className="z-[100] rounded-xl">
              <SelectItem value="all" className="font-bold">
                {t("common.all") || "All Categories"}
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id} className="font-bold">
                  {i18n.language === "ar" ? cat.name.ar : cat.name.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full sm:w-[160px] rounded-xl font-bold border-border/60 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 opacity-50" />
                <SelectValue placeholder={t("management.status")} />
              </div>
            </SelectTrigger>
            <SelectContent className="z-[100] rounded-xl">
              <SelectItem value="all" className="font-bold">
                {t("common.bookNow")?.replace("Book Now", "All Statuses") ||
                  "All Statuses"}
              </SelectItem>
              <SelectItem value="active" className="font-bold">
                {t("dashboard.status.active")}
              </SelectItem>
              <SelectItem value="draft" className="font-bold">
                {t("dashboard.status.draft")}
              </SelectItem>
              <SelectItem value="cancelled" className="font-bold">
                {t("dashboard.status.cancelled")}
              </SelectItem>
              <SelectItem value="sold out" className="font-bold">
                {t("dashboard.status.soldout")}
              </SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== "all" ||
            categoryFilter !== "all" ||
            searchTerm) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
                setSearchTerm("");
              }}
              className="h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground"
              title={t("common.clearFilters") || "Clear filters"}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <EventsTable
        events={filteredEvents}
        user={user}
        t={t}
        i18n={i18n}
        onStatusChange={handleStatusChange}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        onCreate={handleOpenCreate}
        hasFilters={
          statusFilter !== "all" || categoryFilter !== "all" || !!searchTerm
        }
        onClearFilters={() => {
          setStatusFilter("all");
          setCategoryFilter("all");
          setSearchTerm("");
        }}
      />

      <EventFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedEvent={selectedEvent}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
        onAddCategory={async (data) => {
          return await createCategory.mutateAsync(data);
        }}
        isLoading={createEvent.isPending || updateEvent.isPending}
        categories={categories}
        t={t}
      />

      <DeleteEventModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        event={selectedEvent}
        onConfirm={confirmDelete}
        isPending={deleteEvent.isPending}
        t={t}
        i18n={i18n}
      />
    </div>
  );
}
