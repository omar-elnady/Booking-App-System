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
        if (!rolePermissions) return true;
        const permissions = rolePermissions[normalizedRole];
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

  // تحديد اتجاه اللغة لتظبيط الخطوط يمين ولا شمال
  const isRtl = i18n.language === "ar";

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 relative group/sidebar overflow-hidden",
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 justify-start items-center px-6 mb-2 transition-all duration-300 text-right",
          isCollapsed && "px-4 justify-center"
        )}
      >
        <Link
          to={dashboardHome}
          className={cn(
            "flex items-center gap-3 transition-opacity hover:opacity-90"
          )}
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 shrink-0">
            <span className="text-primary-foreground text-xl font-bold italic">
              D
            </span>
          </div>
          {!isCollapsed && (
            <div
              className={cn(
                "flex flex-col gap-1 overflow-hidden animate-in fade-in duration-300"
              )}
            >
              <span className="font-bold text-lg text-start leading-none tracking-tight truncate">
                {t("navbar.logoName")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase opacity-70 truncate">
                {t("dashboard.sideBar.controlPanel")}
              </span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className={cn("flex-1 px-3", isCollapsed && "px-2")}>
        <div className="space-y-6 py-4">
          {filteredNavigation.map((group, index) => {
            const isGroupActive = group.items.some(
              (item) => item.href === location.pathname
            );

            return (
              <div key={index} className="relative group/section">
                {/* Group Title */}
                {!isCollapsed ? (
                  <div
                    className={cn(
                      "px-3 mb-2 flex items-center gap-2 ",
                      isRtl ? "justify-end" : "justify-start"
                    )}
                  >
                    <span className="text-sm font-bold text-foreground/90  text-start tracking-tight">
                      {t(group.titleKey)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center mb-2 w-full">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        isGroupActive
                          ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))] scale-125 animate-pulse"
                          : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                )}

                {/* Items Container */}
                <div
                  className={cn(
                    "relative",
                    !isCollapsed && (isRtl ? "mr-3" : "ml-3")
                  )}
                >
                  <div className="flex flex-col">
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      const isLastItem = itemIndex === group.items.length - 1;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={onClose}
                          className="block relative pb-1"
                        >
                          {!isCollapsed && (
                            <>
                              <div
                                className={cn(
                                  "absolute top-0 w-4 h-[20px] border-b border-border/60 pointer-events-none",
                                  isRtl
                                    ? "right-0 border-r rounded-br-xl"
                                    : "left-0 border-l rounded-bl-xl"
                                )}
                              />
                              {!isLastItem && (
                                <div
                                  className={cn(
                                    "absolute top-[20px] bottom-0 w-px bg-border/60 pointer-events-none",
                                    isRtl ? "right-0" : "left-0"
                                  )}
                                />
                              )}
                            </>
                          )}

                          <div
                            className={cn(
                              "relative",
                              !isCollapsed && (isRtl ? "pr-6" : "pl-6")
                            )}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full gap-2 h-10 px-3 transition-all duration-300 relative group overflow-hidden justify-start",
                                isActive
                                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-bold scale-[1.02]"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                isCollapsed &&
                                  "justify-center w-10 h-10 mx-auto",
                                isRtl && "flex-row-reverse"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-[18px] w-[18px] shrink-0 transition-all duration-300",
                                  isActive
                                    ? "text-black dark:text-white"
                                    : "text-muted-foreground group-hover:text-foreground"
                                )}
                              />
                              {!isCollapsed && (
                                <span
                                  className="text-[13px] truncate"
                                  dir={isRtl ? "rtl" : "ltr"}
                                >
                                  {t(item.titleKey)}
                                </span>
                              )}
                            </Button>
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
          "p-4 bg-muted/5 border-t border-border/40 space-y-2 transition-all duration-300",
          isCollapsed && "p-2"
        )}
      >
        <Link to="/" onClick={onClose}>
          <Button
            variant="ghost"
            className={cn(
              "w-full gap-4 h-11 px-4 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl overflow-hidden",
              isCollapsed ? "px-2 justify-center" : "justify-start"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-semibold whitespace-nowrap animate-in fade-in duration-300">
                {t("dashboard.sideBar.returnHome")}
              </span>
            )}
          </Button>
        </Link>

        <Button
          variant="ghost"
          className={cn(
            "w-full gap-4 h-11 px-4 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all font-semibold group rounded-xl overflow-hidden",
            isCollapsed ? "px-2 justify-center" : "justify-start"
          )}
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && (
            <span className="text-sm font-bold whitespace-nowrap animate-in fade-in duration-300">
              {t("navbar.logout")}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
