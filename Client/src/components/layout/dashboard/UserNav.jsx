import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ActionMenu from "@/components/common/ActionMenu";
import { useAuthStore } from "@features/auth/store/authStore";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "@/lib/roles";
import { useTranslation } from "react-i18next";

export function UserNav() {
  const { user, logout, role } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardRoute = getDashboardRoute(role);

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.userName || "User";

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.userName
      ? user.userName.slice(0, 2).toUpperCase()
      : null;

  const items = [
    {
      type: "custom",
      content: (
        <div className="flex flex-col space-y-1 py-1 px-2">
          <p className="text-sm font-bold leading-none">{fullName}</p>
          <p className="text-xs leading-none text-muted-foreground mt-1">
            {user?.email}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase border border-primary/20 w-fit">
            {role}
          </div>
        </div>
      ),
    },
    { type: "separator" },
    {
      type: "item",
      label: t("navbar.dashboard") || "Dashboard",
      icon: LayoutDashboard,
      onClick: () => navigate(dashboardRoute),
      className: isRtl ? "flex-row-reverse" : "",
    },
    { type: "separator" },
    {
      type: "item",
      label: t("buttons.logout") || "Log out",
      icon: LogOut,
      color: "text-destructive",
      className:
        "text-destructive focus:text-destructive focus:bg-destructive/5",
      onClick: handleLogout,
    },
  ];

  return (
    <ActionMenu
      align={isRtl ? "start" : "end"}
      className="w-60"
      trigger={
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
        >
          <Avatar className="h-9 w-9 border border-border/50 bg-background shadow-sm">
            <AvatarImage
              src={user?.userImage?.secure_url || undefined}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold ring-1 ring-primary/10 transition-colors">
              {initials || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      }
      items={items}
    />
  );
}
