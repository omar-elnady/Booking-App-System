import React, { useState } from "react";
import {
  Menu,
  Bell,
  ChevronRight,
  PanelLeft,
  UserPlus,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { UserNav } from "./UserNav";
import ThemeSwitcher from "@/components/layout/public/ThemeSwitcher";
import LanguageSwitcher from "@/components/layout/public/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuthStore } from "@features/auth/store/authStore";
import { ROLES } from "@/lib/roles";
import { useOrganizerRequests, useCategoryRequests } from "@/hooks/useAdmin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export function DashboardHeader({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const isManagement = [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
  const { data: requestsData } = useOrganizerRequests({
    enabled: isManagement,
  });
  const pendingRequests = requestsData?.requests || [];

  const { data: catData } = useCategoryRequests({ enabled: isManagement });
  const pendingCategories = catData?.requests || [];

  const requestCount = isManagement
    ? pendingRequests.length + pendingCategories.length
    : 0;

  const pathsegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className=" z-40  w-full rounded-t-2xl border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:pe-8">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">
                  {t("dashboard.sideBar.menuLabel")}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRtl ? "right" : "left"}
              className="p-0 border-none w-72 transition-transform duration-500"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{t("dashboard.sideBar.menuLabel")}</SheetTitle>
              </SheetHeader>
              <DashboardSidebar onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Desktop Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            <div className="h-4 w-[1px] bg-border hidden md:block" />

            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold tracking-tight min-w-0">
              <span className="text-muted-foreground/60 hidden sm:block shrink-0">
                {t("navbar.dashboard")}
              </span>
              {pathsegments.map((seg, i) => (
                <React.Fragment key={i}>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground/30 shrink-0",
                      isRtl && "rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "capitalize truncate max-w-[120px] sm:max-w-none",
                      i === pathsegments.length - 1
                        ? "text-primary font-semibold"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {t(
                      `breadcrumbs.${seg.toLowerCase()}`,
                      seg.replace(/-/g, " ")
                    )}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <div className="flex items-center rounded-xl px-2 py-1 bg-muted/20 backdrop-blur-sm">
            <LanguageSwitcher />
            <div className="w-[1px] h-4 bg-border/50 mx-1" />
            <ThemeSwitcher />
          </div>

          {/* Notifications */}
          {isManagement && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {requestCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 p-0 rounded-xl shadow-xl border-border/60"
              >
                <div className="p-4 border-b border-border/40 bg-muted/10">
                  <h4 className="font-bold text-sm leading-none">
                    {t("dashboard.notifications") || "Notifications"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {requestCount > 0
                      ? `${requestCount} ${
                          t("dashboard.pendingRequests") || "new notifications"
                        }`
                      : t("dashboard.noNotifications") ||
                        "No new notifications"}
                  </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {requestCount > 0 ? (
                    <div className="flex flex-col">
                      {pendingRequests.length > 0 && (
                        <div
                          className="p-2 cursor-pointer hover:bg-muted/20 transition-colors border-b border-border/40 last:border-0"
                          onClick={() =>
                            navigate(
                              role === ROLES.SUPER_ADMIN
                                ? "/super-admin/users"
                                : "/admin/users"
                            )
                          }
                        >
                          <div className="flex items-start gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                              <UserPlus className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-semibold">
                                {t("dashboard.organizerRequest") ||
                                  "Organizer Request"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {pendingRequests.length}{" "}
                                {t("dashboard.usersWantToJoin") ||
                                  "users requested to become organizers."}
                              </p>
                              <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wide">
                                {t("dashboard.clickToReview") ||
                                  "Click to review"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {pendingCategories.length > 0 && (
                        <div
                          className="p-2 cursor-pointer hover:bg-muted/20 transition-colors border-b border-border/40 last:border-0"
                          onClick={() => navigate("/admin/manage-events")}
                        >
                          <div className="flex items-start gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                              <LayoutGrid className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-semibold">
                                {t("dashboard.categoryRequest") ||
                                  "Category Request"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {pendingCategories.length}{" "}
                                {t("dashboard.categoriesPending") ||
                                  "new categories awaiting approval."}
                              </p>
                              <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wide">
                                {t("dashboard.clickToReview") ||
                                  "Click to review"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground/50 text-sm">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      {t("dashboard.allCaughtUp") || "All caught up!"}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className="w-[1px] h-6 bg-border/50 mx-2 hidden sm:block" />

          <UserNav />
        </div>
      </div>
    </header>
  );
}
