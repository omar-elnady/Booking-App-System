import React, { useState } from "react";
import {
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "../super-admin/hooks/useAdmin";
import { toast } from "sonner";
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
  Shield,
  User,
  UserCheck,
  UserMinus,
  UserX,
  Activity,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export default function ManageAllUsers() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useAdminUsers();
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();
  const [selectedUser, setSelectedUser] = useState(null);

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const users = data?.users || [];

  const COLUMNS = [
    { key: "user", label: t("management.userTable") },
    { key: "role", label: t("management.role") },
    { key: "status", label: t("management.status") },
    { key: "date", label: t("management.joinedDate") },
    { key: "actions", label: t("management.actions"), className: "text-right" },
  ];

  const ROLE_OPTIONS = [
    {
      id: "user",
      label: t("management.userAccount"),
      icon: User,
      color: "text-muted-foreground",
    },
    {
      id: "organizer",
      label: t("management.organizerAccess"),
      icon: Activity,
      color: "text-primary/70",
    },
    { id: "admin", label: "Admin", icon: Shield, color: "text-blue-500/70" },
    {
      id: "super-admin",
      label: "Super Admin",
      icon: Shield,
      color: "text-primary/70",
      fill: true,
    },
  ];

  const STATUS_OPTIONS = [
    {
      id: "active",
      label: t("management.reactivateProfile"),
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      id: "inactive",
      label: t("management.deactivateTemporary"),
      icon: UserMinus,
      color: "text-yellow-600",
    },
    {
      id: "blocked",
      label: t("management.terminateAccess"),
      icon: UserX,
      color: "text-red-600",
    },
  ];

  const handleRoleChange = (user, newRole) => {
    // Prevent changing Super Admin role
    if (user.role === "super-admin") {
      return toast.error(t("management.cannotChangeSuperAdmin"));
    }

    if (user.role === newRole) {
      return toast.info(
        `${t("management.user")} ${user.userName} ${t(
          "superAdmin.alreadyIs"
        )} ${newRole}`
      );
    }
    updateUserRole.mutate({ userId: user._id, role: newRole });
  };

  const handleStatusChange = (user, newStatus) => {
    if (user.status === newStatus) {
      return toast.info(
        `${t("management.user")} ${user.userName} ${t(
          "superAdmin.alreadyIs"
        )} ${t(`dashboard.status.${newStatus}`)}`
      );
    }
    updateUserStatus.mutate({ userId: user._id, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("management.userManagement")}
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          {t("management.userManagementSubtitle")}
        </p>
      </div>

      <div className="border border-border/40 rounded-xl bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/40">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn("font-bold text-foreground/80", col.className)}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-muted/10 transition-colors border-border/40"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border/60">
                      <AvatarImage src={user.userImage?.secure_url} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs uppercase">
                        {user.userName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight text-foreground/90">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground/80">
                        @{user.userName} • {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-md",
                      user.role === "super-admin"
                        ? "border-primary/50 bg-primary/10 text-primary shadow-sm"
                        : user.role === "admin"
                        ? "border-blue-500/40 bg-blue-500/5 text-blue-600"
                        : "text-muted-foreground/70 border-border/60"
                    )}
                  >
                    {user.role === "super-admin"
                      ? "Super Admin"
                      : user.role === "admin"
                      ? "Admin"
                      : user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-md border shadow-none",
                      user.status === "active"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : user.status === "inactive"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    )}
                  >
                    {t(`dashboard.status.${user.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-[13px] text-muted-foreground/80 font-medium whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString(i18n.language)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted/40 transition-colors rounded-lg text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 rounded-xl shadow-xl border-border/60 p-1.5 font-bold"
                    >
                      <DropdownMenuItem
                        className="rounded-lg gap-2 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />{" "}
                        {t("management.viewFullProfile")}
                      </DropdownMenuItem>

                      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-black border-t border-border/40 mt-1.5">
                        {t("management.securityAndRoles")}
                      </div>
                      {ROLE_OPTIONS.map((role) => (
                        <DropdownMenuItem
                          key={role.id}
                          className="rounded-lg gap-2 cursor-pointer"
                          onClick={() => handleRoleChange(user, role.id)}
                        >
                          <role.icon
                            className={cn(
                              "h-4 w-4",
                              role.color,
                              role.fill && "fill-current/10"
                            )}
                          />
                          {role.label}
                        </DropdownMenuItem>
                      ))}

                      <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-black border-t border-border/40 mt-1.5">
                        {t("management.accountStatus")}
                      </div>
                      {STATUS_OPTIONS.map((status) => (
                        <DropdownMenuItem
                          key={status.id}
                          onClick={() => handleStatusChange(user, status.id)}
                          className={cn(
                            "rounded-lg gap-2 cursor-pointer focus:bg-muted/50",
                            status.color,
                            `focus:${status.color}`
                          )}
                        >
                          <status.icon className="h-4 w-4" /> {status.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-2xl border-border/60 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-border/40 bg-muted/10">
            <DialogTitle className="font-bold text-xl">
              {t("management.userProfileDetail")}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t("management.reviewingParameters")} {selectedUser?.userName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col items-center py-8 px-6 space-y-6">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src={selectedUser.userImage?.secure_url} />
                <AvatarFallback className="text-3xl font-bold bg-primary/5 text-primary">
                  {selectedUser.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-primary font-bold text-sm">
                  @{selectedUser.userName}
                </p>
              </div>

              <div className="w-full grid grid-cols-1 gap-3 pt-2">
                {[
                  {
                    icon: Mail,
                    label: t("management.email"),
                    value: selectedUser.email,
                  },
                  {
                    icon: Shield,
                    label: t("management.functionalRole"),
                    value: selectedUser.role,
                    capitalize: true,
                  },
                  {
                    icon: Calendar,
                    label: t("management.registrationDate"),
                    value: new Date(selectedUser.createdAt).toLocaleDateString(
                      i18n.language,
                      { dateStyle: "long" }
                    ),
                  },
                ].map((info, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-muted/30 border border-border/40 rounded-2xl"
                  >
                    <info.icon className="h-4 w-4 text-muted-foreground/60" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/40">
                        {info.label}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          info.capitalize && "capitalize"
                        )}
                      >
                        {info.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
