import React from "react";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionMenu from "@/components/common/ActionMenu";
import EmptyState from "@/components/common/EmptyState";
import {
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/roles";

const EventsTable = ({
  events,
  user,
  t,
  i18n,
  onStatusChange,
  onEdit,
  onDelete,
  onCreate,
  hasFilters,
  onClearFilters,
}) => {
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

  const columns = [
    {
      key: "event",
      label: t("management.events"),
      className: "lowercase first-letter:uppercase",
      render: (event) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/40 bg-muted/20 flex items-center justify-center shrink-0">
            {event.image?.secure_url ? (
              <img
                src={event.image.secure_url}
                className="w-full h-full object-cover"
                alt={event.name?.en || "Event"}
              />
            ) : (
              <Calendar className="h-5 w-5 text-muted-foreground/40" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-foreground/90">
              {i18n.language === "ar" ? event.name?.ar : event.name?.en}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground/60">
              {new Date(event.date).toLocaleDateString(i18n.language)}
            </span>
            <span className="text-[10px] text-muted-foreground/50 truncate max-w-[150px]">
              {i18n.language === "ar"
                ? event.venue?.ar || event.venue
                : event.venue?.en || event.venue}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: t("buttons.categoryLabel"),
      render: (event) => (
        <Badge
          variant="secondary"
          className="font-bold text-[10px] uppercase tracking-wider rounded-md bg-muted/50 text-muted-foreground/80 border border-border/40"
        >
          {i18n.language === "ar"
            ? event.category?.name?.ar || event.category?.name
            : event.category?.name?.en || event.category?.name}
        </Badge>
      ),
    },
    {
      key: "price",
      label: t("management.price"),
      className: "whitespace-nowrap font-bold text-sm text-foreground/80",
      render: (event) => (
        <>
          {event.price} {t("dashboard.currency")}
        </>
      ),
    },
    {
      key: "status",
      label: t("management.status"),
      render: (event) => (
        <Badge
          variant="secondary"
          className={cn(
            "font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-md border shadow-none",
            event.status === "Active"
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : "bg-muted/50 text-muted-foreground border border-border/50"
          )}
        >
          {t(`dashboard.status.${event.status.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: "createdBy",
      label: t("management.customer"),
      render: (event) => (
        <div className="text-xs font-bold text-muted-foreground/70">
          @{event.createdBy?.userName || "System"}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("management.actions"),
      className: "text-right",
      render: (event) =>
        canEditEvent(event) && (
          <ActionMenu
            align="end"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/40 transition-colors rounded-lg text-muted-foreground/60"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
            items={[
              {
                type: "label",
                label: t("management.status"),
              },
              {
                type: "item",
                label: t("management.activateEvent"),
                icon: CheckCircle,
                className: "text-green-600",
                onClick: () => onStatusChange(event, "Active"),
              },
              {
                type: "item",
                label: t("management.setDraft"),
                icon: Clock,
                className: "text-slate-500",
                onClick: () => onStatusChange(event, "Draft"),
              },
              {
                type: "item",
                label: t("management.cancelEvent"),
                icon: XCircle,
                className: "text-destructive",
                onClick: () => onStatusChange(event, "Cancelled"),
              },
              {
                type: "label",
                label: t("management.manageEvents"),
              },
              {
                type: "item",
                label: t("buttons.edit") || "Edit",
                icon: Edit,
                className: "text-blue-600",
                onClick: () => onEdit(event),
              },
              {
                type: "item",
                label: t("buttons.delete") || "Delete",
                icon: Trash2,
                className: "text-destructive",
                onClick: () => onDelete(event),
              },
            ]}
          />
        ),
    },
  ];

  const emptyStateContent = !hasFilters ? (
    <EmptyState
      icon={Calendar}
      title={t("manageEvents.noEvents") || "No events found"}
      description={
        t("manageEvents.noEventsDesc") ||
        "Get started by creating your first event."
      }
      className="h-[40vh] border-dashed border-border/60 rounded-xl bg-muted/5 mt-8 shadow-none"
      action={
        <Button
          onClick={onCreate}
          className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 h-11 px-6 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
          {t("manageEvents.createEvent")}
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={Search}
      title={t("common.noResults") || "No results found"}
      description={
        t("common.noResultsDesc") ||
        "Try adjusting your search or filters to find what you're looking for."
      }
      className="h-[50vh] border-border/40 rounded-xl bg-muted/5 mt-8 shadow-none"
      action={
        <Button
          variant="outline"
          className="font-bold rounded-xl mt-4 px-8 h-11 shadow-sm border-border/60 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
          onClick={onClearFilters}
        >
          {t("common.clearAllFilters") || "Clear all filters"}
        </Button>
      }
    />
  );

  return (
    <DataTable
      columns={columns}
      data={events}
      emptyMessage={emptyStateContent}
    />
  );
};

export default EventsTable;
