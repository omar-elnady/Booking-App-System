import React, { useState } from "react";
import {
  useAdminEvents,
  useUpdateEventStatus,
  useDeleteEvent,
  useCreateEvent,
  useUpdateEvent,
} from "../super-admin/hooks/useAdmin";
import { useCategories } from "@/hooks/useCategories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Trash2,
  Edit,
  Plus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import EventForm from "@features/events/components/EventForm";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ROLES } from "@/lib/roles";

export default function ManageAllEvents() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useAdminEvents();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];
  const updateEventStatus = useUpdateEventStatus();
  const deleteEvent = useDeleteEvent();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const events = data?.events || [];

  // Filter events based on role
  const filteredEvents = events.filter((event) => {
    // Admin and SuperAdmin see all events
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
      return true;
    }

    // Organizer sees only their own events
    if (user?.role === ROLES.ORGANIZER) {
      return (
        event.createdBy?._id === user?._id ||
        event.organizerId === user?._id ||
        event.createdBy === user?._id
      );
    }

    return false;
  });

  const canEditEvent = (event) => {
    // Admin and SuperAdmin can edit all events
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
      return true;
    }

    // Organizer can edit only their own events
    if (user?.role === ROLES.ORGANIZER) {
      return (
        event.createdBy?._id === user?._id ||
        event.organizerId === user?._id ||
        event.createdBy === user?._id
      );
    }

    return false;
  };

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

      <div className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="font-bold text-foreground/80 lowercase first-letter:uppercase">
                {t("management.events")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("buttons.categoryLabel")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.price")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.status")}
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                {t("management.customer")}{" "}
              </TableHead>
              <TableHead className="text-right font-bold text-foreground/80">
                {t("management.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow
                key={event._id}
                className="hover:bg-muted/10 transition-colors border-border/40"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/40 bg-muted/20 flex items-center justify-center shrink-0">
                      {event.image?.secure_url ? (
                        <img
                          src={event.image.secure_url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Calendar className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight text-foreground/90">
                        {i18n.language === "ar"
                          ? event.name?.ar
                          : event.name?.en}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground/60">
                        {new Date(event.date).toLocaleDateString(i18n.language)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-bold text-[10px] uppercase tracking-wider rounded-md bg-muted/50 text-muted-foreground/80 border border-border/40"
                  >
                    {i18n.language === "ar"
                      ? event.category?.name?.ar || event.category?.name
                      : event.category?.name?.en || event.category?.name}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-sm text-foreground/80 whitespace-nowrap">
                  {event.price} {t("dashboard.currency")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-md border shadow-none",
                      event.status === "Active"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-muted/50 text-muted-foreground border border-border/50"
                    )}
                  >
                    {t(`dashboard.status.${event.status.toLowerCase()}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-bold text-muted-foreground/70">
                    @{event.createdBy?.userName || "System"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {canEditEvent(event) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted/40 transition-colors rounded-lg text-muted-foreground/60"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-xl shadow-xl border-border/60 p-1.5 font-semibold"
                      >
                        <DropdownMenuItem
                          className="rounded-lg gap-2 cursor-pointer"
                          onClick={() => handleStatusChange(event, "Active")}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />{" "}
                          {t("management.activateEvent")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg gap-2 cursor-pointer"
                          onClick={() => handleStatusChange(event, "Draft")}
                        >
                          <Clock className="h-4 w-4 text-slate-500" />{" "}
                          {t("management.setDraft")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg gap-2 cursor-pointer"
                          onClick={() => handleStatusChange(event, "Cancelled")}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />{" "}
                          {t("management.cancelEvent")}
                        </DropdownMenuItem>

                        <div className="border-t border-border/40 my-1.5" />

                        <DropdownMenuItem
                          className="rounded-lg gap-2 cursor-pointer text-blue-600 focus:text-blue-600"
                          onClick={() => handleOpenEdit(event)}
                        >
                          <Edit className="h-4 w-4" />{" "}
                          {t("manageEvents.updateCategoryDesc")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(event)}
                        >
                          <Trash2 className="h-4 w-4" />{" "}
                          {t("manageEvents.confirmDelete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Event Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl rounded-2xl border-border/60 p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-border/40 bg-muted/10">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {selectedEvent
                ? t("manageEvents.updateCategoryDesc")
                : t("manageEvents.addNew")}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground/70">
              {t("management.eventsSubtitle")}
            </DialogDescription>
          </div>
          <div className="p-6 pt-2">
            <EventForm
              onSubmit={handleFormSubmit}
              initialData={selectedEvent}
              categories={categories}
              isLoading={createEvent.isPending || updateEvent.isPending}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold">
              <AlertCircle className="h-5 w-5" />{" "}
              {t("manageEvents.confirmDelete")}
            </DialogTitle>
            <DialogDescription className="pt-2 font-medium text-muted-foreground/80">
              {t("manageEvents.confirmDeleteDesc")}
              <div className="mt-2 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive font-semibold text-sm">
                {i18n.language === "ar"
                  ? selectedEvent?.name?.ar
                  : selectedEvent?.name?.en}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              className="rounded-xl font-semibold border-border/60"
              onClick={() => setIsDeleteOpen(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl font-semibold text-white hover:bg-destructive/80 px-6 shadow-lg shadow-destructive/10"
              onClick={confirmDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? (
                <Activity className="animate-spin h-4 w-4" />
              ) : (
                t("buttons.submit")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
