import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@features/auth/store/authStore";
import { User, Settings, LogOut, ShieldCheck, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "@/lib/roles";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, logout, role } = useAuthStore();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateTo = (path) => {
    const base = getDashboardRoute(role).replace("/dashboard", "");
    navigate(`${base}${path}`);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu dir={i18n.dir()}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
        >
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align={isRtl ? "start" : "end"}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="text-sm font-bold leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {user?.email}
            </p>
            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase border border-primary/20 w-fit">
              {role}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigateTo("/profile")}
          >
            <User className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigateTo("/security")}
          >
            <ShieldCheck className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
            <span>Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
        >
          <LogOut className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
