import React, { useState, useEffect } from "react";
import {
  useAdminSettings,
  useUpdateSettings,
} from "../super-admin/hooks/useAdmin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Check,
  Lock,
  Info,
  Plus,
  X,
  Save,
  Activity,
  ChevronRight,
  Globe,
  Settings as SettingsIcon,
  Calendar,
  Users,
  Ticket,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

// All possible system features mapped to their base routes or description keys
const ALL_SYSTEM_FEATURES = [
  { id: "/dashboard", titleKey: "superAdmin.dashboard", icon: LayoutDashboard },
  { id: "/users", titleKey: "superAdmin.users", icon: Users },
  { id: "/events", titleKey: "superAdmin.events", icon: Calendar },
  { id: "/bookings", titleKey: "superAdmin.bookings", icon: Ticket },
  { id: "/history", titleKey: "userDashboard.eventsAttended", icon: Calendar },
  { id: "/categories", titleKey: "manageEvents.tabCategories", icon: Activity },
  { id: "/roles", titleKey: "superAdmin.roles", icon: Shield },
  { id: "/profile", titleKey: "userForm.title", icon: Globe },
  { id: "/security", titleKey: "changePassword.title", icon: Lock },
];

export default function RolesPermissions() {
  const { t } = useTranslation();
  const { data, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();
  const [localPermissions, setLocalPermissions] = useState(null);
  const [activeRole, setActiveRole] = useState("organizer");

  useEffect(() => {
    if (data?.settings?.rolePermissions) {
      setLocalPermissions(data.settings.rolePermissions);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const togglePermission = (role, featureId) => {
    const rolePerms = localPermissions[role] || [];
    const hasPerm = rolePerms.includes(featureId);

    let updatedPerms;
    if (hasPerm) {
      updatedPerms = rolePerms.filter((p) => p !== featureId);
    } else {
      updatedPerms = [...rolePerms, featureId];
    }

    setLocalPermissions({
      ...localPermissions,
      [role]: updatedPerms,
    });
  };

  const handleSave = () => {
    updateSettings.mutate({
      ...data.settings,
      rolePermissions: localPermissions,
    });
  };

  const roles = ["super-admin", "admin", "organizer", "user"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("superAdmin.systemArchitecture")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("superAdmin.configurePermissions")}
          </p>
        </div>
        <Button
          className="font-bold gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/5 transition-all active:scale-95"
          onClick={handleSave}
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4" /> {t("superAdmin.saveConfiguration")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Role Selector */}
        <div className="lg:col-span-1 space-y-1">
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            {t("superAdmin.structureRoles")}
          </div>
          {roles.map((r) => (
            <Button
              key={r}
              variant={activeRole === r ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-between font-bold capitalize h-12 px-4 rounded-xl transition-all",
                activeRole === r
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground/70 hover:bg-muted/50 border border-transparent"
              )}
              onClick={() => setActiveRole(r)}
            >
              <div className="flex items-center gap-2">
                <Shield
                  className={cn(
                    "h-4 w-4",
                    activeRole === r
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  )}
                />
                {t(
                  `superAdmin.${
                    r === "super-admin"
                      ? "superAdmin"
                      : r === "admin"
                      ? "administrator"
                      : r === "organizer"
                      ? "organizerAccess"
                      : "userAccount"
                  }`
                )}
              </div>
              {activeRole === r && <ChevronRight className="h-4 w-4" />}
            </Button>
          ))}
        </div>

        {/* Feature Permissions Editor */}
        <div className="lg:col-span-3">
          <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="capitalize text-lg font-bold">
                    {t(
                      `superAdmin.${
                        activeRole === "super-admin"
                          ? "administrator"
                          : activeRole === "admin"
                          ? "administrator"
                          : activeRole === "organizer"
                          ? "organizerAccess"
                          : "userAccount"
                      }`
                    )}{" "}
                    {t("superAdmin.routeAccess")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground/60">
                    {t("superAdmin.toggleModules")}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="font-bold text-[10px] uppercase bg-background border-border/60"
                >
                  {localPermissions?.[activeRole]?.length || 0}{" "}
                  {t("superAdmin.featuresCount")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[430px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/20">
                  {ALL_SYSTEM_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    const isEnabled = localPermissions?.[activeRole]?.includes(
                      feature.id
                    );

                    return (
                      <div
                        key={feature.id}
                        className={cn(
                          "flex items-center justify-between p-4 bg-background transition-colors cursor-pointer group hover:bg-muted/10",
                          isEnabled && "bg-primary/[0.01]"
                        )}
                        onClick={() => togglePermission(activeRole, feature.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center transition-all border",
                              isEnabled
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                                : "bg-muted/20 text-muted-foreground/30 border-border/40 group-hover:border-border"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-sm font-bold transition-colors",
                                isEnabled
                                  ? "text-foreground"
                                  : "text-muted-foreground/60"
                              )}
                            >
                              {t(feature.titleKey)}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground/40 font-mono">
                              {feature.id}
                            </span>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            isEnabled
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border/40 group-hover:border-border"
                          )}
                        >
                          {isEnabled && (
                            <Check className="h-3 w-3" strokeWidth={4} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="p-4 bg-muted/20 border-t border-border/40 flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-muted-foreground/70 leading-relaxed">
                  {t("superAdmin.routingInfo")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
