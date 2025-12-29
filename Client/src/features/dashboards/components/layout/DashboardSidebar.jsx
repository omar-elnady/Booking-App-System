import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboardNavigation } from "../../config/navigation";
import { useAuthStore } from "@features/auth/store/authStore";
import { LogOut, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDashboardRoute } from "@/lib/roles";

import { useAdminSettings } from "../../super-admin/hooks/useAdmin";
export function DashboardSidebar({ className, onClose, isCollapsed }) {
  const location = useLocation();
  const { role, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  // Normalize role to lowercase to ensure consistency
  const normalizedRole = role?.toLowerCase();

  const navigation = getDashboardNavigation(normalizedRole);
  const isRtl = i18n.dir() === "rtl";
  const dashboardHome = getDashboardRoute(normalizedRole);

  // Fetch dynamic permissions
  const { data: settingsData } = useAdminSettings();
  const rolePermissions = settingsData?.settings?.rolePermissions;

  // Filter navigation based on permissions
  const filteredNavigation = navigation
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        // 1. If global settings haven't loaded yet, default to SHOWING items (optimistic)
        //    or hiding them if you prefer security-first.
        //    Given the issue, let's assume if settings are missing, we show defaults.
        if (!rolePermissions) return true;

        // 2. Get permissions for this specific role
        const permissions = rolePermissions[normalizedRole];

        // 3. If no permissions are customized for this role in the DB,
        //    assume the default hardcoded navigation is valid and show it.
        if (!permissions || !Array.isArray(permissions)) return true;

        // 4. Extract feature key (e.g., /admin/users -> /users)
        const featureKey = item.href.replace(`/${normalizedRole}`, "");

        // 5. Normalization for robust comparison
        //    Ensure we are comparing apples to apples (e.g. both have leading slashes)
        //    featureKey usually comes out as "/events".
        //    DB permissions usually look like "/events".

        // Match exact key
        if (permissions.includes(featureKey)) return true;

        // Only special case: /history
        if (featureKey === "/history" && permissions.includes("/history"))
          return true;

        return false;
      });

      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 relative group/sidebar",
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 items-center px-6 mb-2 transition-all duration-300",
          isCollapsed && "px-4 justify-center"
        )}
      >
        <Link
          to={dashboardHome}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 shrink-0">
            <span className="text-primary-foreground text-xl font-bold italic">
              D
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col gap-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="font-bold text-xl leading-none tracking-tight whitespace-nowrap">
                {t("navbar.logoName")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase opacity-70 whitespace-nowrap">
                {t("dashboard.sideBar.controlPanel")}
              </span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          {filteredNavigation.map((group, index) => (
            <div key={index} className="space-y-2">
              <h3
                className={cn(
                  "px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 transition-all duration-300",
                  isRtl ? "text-right" : "text-left",
                  isCollapsed && "opacity-0 h-0 overflow-hidden"
                )}
              >
                {t(group.titleKey)}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link key={item.href} to={item.href} onClick={onClose}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-4 h-10 px-4 transition-all duration-200 relative group rounded-xl overflow-hidden",
                          isActive
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          isRtl ? "flex-row-reverse text-right" : "text-left",
                          isCollapsed && "px-2 justify-center"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground/70"
                          )}
                        />
                        {!isCollapsed && (
                          <span
                            className={cn(
                              "flex-1 text-[13px] tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300",
                              isActive ? "font-bold" : "font-medium"
                            )}
                          >
                            {t(item.titleKey)}
                          </span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Info & Actions Area */}
      <div
        className={cn(
          "p-4 bg-muted/5 border-t border-border/40 space-y-2 transition-all duration-300",
          isCollapsed && "p-2"
        )}
      >
        {/* Return Home Link */}
        <Link to="/" onClick={onClose}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-4 h-11 px-4 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl overflow-hidden",
              isRtl ? "flex-row-reverse text-right" : "text-left",
              isCollapsed && "px-2 justify-center"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-semibold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                {t("dashboard.sideBar.returnHome")}
              </span>
            )}
          </Button>
        </Link>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-4 h-11 px-4 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all font-semibold group rounded-xl overflow-hidden",
            isRtl ? "flex-row-reverse" : "text-left",
            isCollapsed && "px-2 justify-center"
          )}
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
        >
          <LogOut
            className={cn(
              "h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1",
              isRtl && "group-hover:translate-x-1 rotate-180"
            )}
          />
          {!isCollapsed && (
            <span className="text-sm font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              {t("navbar.logout")}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
