import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboardNavigation } from "@/config/dashboardNavigation";

import { useAuthStore } from "@features/auth/store/authStore";
import { LogOut, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDashboardRoute } from "@/lib/roles";
import { useAdminSettings } from "@/hooks/useAdmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardSidebar({ className, onClose, isCollapsed }) {
  const location = useLocation();
  const { role, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const normalizedRole = role?.toLowerCase();

  const navigation = getDashboardNavigation(normalizedRole);
  const dashboardHome = getDashboardRoute(normalizedRole);

  const { data: settingsData } = useAdminSettings();
  const rolePermissions = settingsData?.settings?.rolePermissions;

  const filteredNavigation = navigation
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        if (
          item.href === "/user/wishlist" ||
          item.href === "/user/following" ||
          item.href === "/user/transactions"
        ) {
          return true;
        }

        const permissions = rolePermissions
          ? rolePermissions[normalizedRole]
          : null;
        if (!permissions || !Array.isArray(permissions)) return true;
        const featureKey = item.href.replace(`/${normalizedRole}`, "");
        if (permissions.includes(featureKey)) return true;
        if (featureKey === "/history" && permissions.includes("/history"))
          return true;
        return false;
      });

      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  const isRtl = i18n.language === "ar";

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background transition-all duration-300 ease-in-out relative group/sidebar overflow-hidden text-clip",
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 items-center mb-2 transition-all duration-300 ease-in-out relative",
          isCollapsed ? "justify-center px-0 w-full" : "justify-start px-6"
        )}
      >
        <Link
          to={dashboardHome}
          className={cn(
            "flex items-center gap-3 transition-all duration-300 hover:opacity-90 w-full overflow-hidden whitespace-nowrap",
            isCollapsed && "justify-center gap-0" // Ensure gap is 0 when collapsed
          )}
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 shrink-0 transition-transform duration-300">
            <span className="text-primary-foreground text-xl font-bold italic">
              D
            </span>
          </div>
          <div
            className={cn(
              "flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out",
              isCollapsed
                ? "w-0 opacity-0 translate-x-[-10px]"
                : "w-40 opacity-100 translate-x-0"
            )}
          >
            <span className="font-bold text-lg text-start leading-none tracking-tight truncate">
              {t("navbar.logoName")}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase opacity-70 truncate">
              {t("dashboard.sideBar.controlPanel")}
            </span>
          </div>
        </Link>
      </div>

      <ScrollArea
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "px-0" : "px-3"
        )}
      >
        <div
          className={cn(
            "space-y-6 py-4 transition-all duration-300",
            isCollapsed && "px-0"
          )}
        >
          {filteredNavigation.map((group, index) => {
            const isGroupActive = group.items.some(
              (item) => item.href === location.pathname
            );

            return (
              <div key={index} className="relative group/section">
                {/* Group Title / Dot */}
                <div
                  className={cn(
                    "mb-2 flex items-center overflow-hidden transition-all duration-300 ease-in-out h-6",
                    isCollapsed
                      ? "justify-center px-0"
                      : "px-3 justify-start gap-2",
                    !isCollapsed && isRtl && "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      isGroupActive
                        ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))] scale-125 animate-pulse"
                        : "bg-muted-foreground/40",
                      !isCollapsed && "hidden"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-bold text-foreground/90 text-start tracking-tight truncate transition-all duration-300 ease-in-out",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {t(group.titleKey)}
                  </span>
                </div>

                {/* Items Container */}
                <div
                  className={cn(
                    "relative transition-all duration-300 ease-in-out",
                    !isCollapsed && (isRtl ? "mr-3" : "ml-3")
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col transition-all duration-300 ease-in-out",
                      isCollapsed && "items-center"
                    )}
                  >
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      const isLastItem = itemIndex === group.items.length - 1;

                      const ItemContent = (
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-10 transition-all duration-300 ease-in-out relative group overflow-hidden items-center",
                            isActive
                              ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-bold scale-[1.02]"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            isCollapsed
                              ? "w-10 justify-center px-0 mx-auto rounded-xl gap-0" // Ensures gap is 0
                              : "w-full justify-start gap-3 px-3 rounded-md", // Gap is applied only when expanded
                            isRtl &&
                              !isCollapsed &&
                              "flex-row-reverse text-right"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-all duration-300 ease-in-out",
                              isActive
                                ? "text-black dark:text-white"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "text-[13px] truncate transition-all duration-300 ease-in-out whitespace-nowrap",
                              isCollapsed
                                ? "w-0 opacity-0 translate-x-[-5px]"
                                : "w-auto opacity-100 translate-x-0"
                            )}
                            dir={isRtl ? "rtl" : "ltr"}
                          >
                            {t(item.titleKey)}
                          </span>
                        </Button>
                      );

                      // Tooltip Wrapper Logic
                      const WrappedContent = isCollapsed ? (
                        <TooltipProvider key={item.href} delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {ItemContent}
                            </TooltipTrigger>
                            <TooltipContent side={isRtl ? "left" : "right"}>
                              <p>{t(item.titleKey)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        ItemContent
                      );

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={onClose}
                          className={cn(
                            "block relative pb-1 transition-all duration-300 ease-in-out",
                            isCollapsed && "w-10 mx-auto"
                          )}
                        >
                          {!isCollapsed && (
                            <>
                              <div
                                className={cn(
                                  "absolute top-0 w-4 h-[20px] border-b border-border/60 pointer-events-none transition-opacity duration-300",
                                  isRtl
                                    ? "right-0 border-r rounded-br-xl"
                                    : "left-0 border-l rounded-bl-xl"
                                )}
                              />
                              {!isLastItem && (
                                <div
                                  className={cn(
                                    "absolute top-[20px] bottom-0 w-px bg-border/60 pointer-events-none transition-opacity duration-300",
                                    isRtl ? "right-0" : "left-0"
                                  )}
                                />
                              )}
                            </>
                          )}
                          <div
                            className={cn(
                              "relative transition-all duration-300 ease-in-out",
                              !isCollapsed && (isRtl ? "pr-6" : "pl-6")
                            )}
                          >
                            {WrappedContent}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Info & Actions Area */}
      <div
        className={cn(
          "p-4 bg-muted/5 border-t border-border/40 space-y-2 transition-all duration-300 ease-in-out",
          isCollapsed ? "p-2" : "p-4"
        )}
      >
        <Link
          to="/"
          onClick={onClose}
          className={cn(
            "block transition-all duration-300",
            isCollapsed ? "w-10 mx-auto" : "w-full"
          )}
        >
          {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 px-0 justify-center rounded-xl overflow-hidden gap-0" // Gap 0
                  >
                    <Home className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isRtl ? "left" : "right"}>
                  <p>{t("dashboard.sideBar.returnHome")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full gap-4 h-11 px-4 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl overflow-hidden justify-start"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap animate-in fade-in duration-300">
                {t("dashboard.sideBar.returnHome")}
              </span>
            </Button>
          )}
        </Link>

        <div
          className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-10 mx-auto" : "w-full"
          )}
        >
          {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 px-0 justify-center rounded-xl overflow-hidden text-destructive/80 hover:text-destructive hover:bg-destructive/10 gap-0" // Gap 0
                    onClick={() => {
                      logout();
                      if (onClose) onClose();
                    }}
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isRtl ? "left" : "right"}>
                  <p>{t("navbar.logout")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full gap-4 h-11 px-4 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all font-semibold group rounded-xl overflow-hidden justify-start"
              onClick={() => {
                logout();
                if (onClose) onClose();
              }}
            >
              <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold whitespace-nowrap animate-in fade-in duration-300">
                {t("navbar.logout")}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
