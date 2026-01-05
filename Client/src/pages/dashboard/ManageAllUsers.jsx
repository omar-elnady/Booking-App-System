import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
  useOrganizerRequests,
  useHandleOrganizerRequest,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import DataTable from "@/components/common/DataTable";
import ActionMenu from "@/components/common/ActionMenu";
import Modal from "@/components/common/Modal";
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
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/features/auth/store/authStore";

export default function ManageAllUsers() {
  const { user: currentUser } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useAdminUsers();
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();
  const isOrganizer = currentUser?.role === "organizer";
  const { data: requestsData } = useOrganizerRequests({
    enabled: !isOrganizer,
  });
  const handleRequest = useHandleOrganizerRequest();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'approved' | 'rejected'
    request: null,
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Activity className="animate-spin text-primary" />
      </div>
    );

  const users = data?.users || [];

  /* Remove super-admin from options */
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

  const COLUMNS = [
    {
      key: "user",
      label: t("management.userTable"),
      render: (user) => (
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
      ),
    },
    {
      key: "role",
      label: t("management.role"),
      render: (user) => (
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
      ),
    },
    {
      key: "status",
      label: t("management.status"),
      render: (user) => (
        <Badge
          variant="outline"
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
      ),
    },
    {
      key: "createdAt",
      label: t("management.joinedDate"),
      render: (user) => (
        <span className="text-[13px] text-muted-foreground/80 font-medium whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString(i18n.language)}
        </span>
      ),
    },
    !isOrganizer && {
      key: "actions",
      label: t("management.actions"),
      className: "text-right",
      render: (user) => {
        const isSelf = user._id === currentUser?.id;
        const isTargetSuperAdmin = user.role === "super-admin";

        // Prevent editing yourself
        if (isSelf) {
          return (
            <Badge
              variant="secondary"
              className="opacity-50 cursor-not-allowed"
            >
              {t("management.you")}
            </Badge>
          );
        }

        if (isTargetSuperAdmin) {
          return (
            <Badge
              variant="outline"
              className="opacity-75 cursor-not-allowed border-primary/20 bg-primary/5 text-primary"
            >
              {t("management.superAdmin") || "Super Admin"}
            </Badge>
          );
        }

        // Prevent editing super-admin if you are not one (though backend should also protect)
        // But for UI, let's just disabling editing Super Admins for now via this menu as requested context implies strictness
        // Actually, if I am a super admin, I can edit other super admins? Maybe.
        // But user said "The row of his own should not have the ... active bar".

        return (
          <ActionMenu
            align="end"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/40 transition-colors rounded-lg text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
            items={[
              {
                type: "item",
                label: t("management.viewFullProfile"),
                icon: Eye,
                onClick: () => setSelectedUser(user),
              },
              {
                type: "label",
                label: t("management.securityAndRoles"),
              },
              ...ROLE_OPTIONS.map((role) => ({
                type: "item",
                label: role.label,
                icon: role.icon,
                className: cn(role.color, role.fill && "fill-current/10"),
                onClick: () => handleRoleChange(user, role.id),
              })),
              {
                type: "label",
                label: t("management.accountStatus"),
              },
              ...STATUS_OPTIONS.map((status) => ({
                type: "item",
                label: status.label,
                icon: status.icon,
                className: status.color,
                onClick: () => handleStatusChange(user, status.id),
              })),
            ]}
          />
        );
      },
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("management.userManagement")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("management.userManagementSubtitle")}
          </p>
        </div>
        {requestsData?.requests?.length > 0 && (
          <Button
            onClick={() => setShowRequests(!showRequests)}
            variant={showRequests ? "secondary" : "default"}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {showRequests
              ? t("management.hideRequests") || "Hide Requests"
              : t("management.viewRequestsNoCount") || "View Requests"}
            <Badge
              variant="secondary"
              className="ml-1 bg-background/20 text-current hover:bg-background/30"
            >
              {requestsData.requests.length}
            </Badge>
          </Button>
        )}
      </div>
      <AnimatePresence>
        {showRequests && requestsData?.requests?.length > 0 && !isOrganizer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden mb-6">
              <CardHeader className="border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {t("management.pendingOrganizerRequests") ||
                        "Pending Organizer Requests"}
                      <Badge
                        variant="secondary"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {requestsData.requests.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-primary/70">
                      {t("management.pendingRequestsSubtitle") ||
                        "Review and manage users requesting organizer access"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {requestsData.requests.map((req) => (
                    <div
                      key={req._id}
                      className="group relative bg-card border border-border hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4"
                    >
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={req.userImage?.secure_url} />
                          <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {req.firstName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-background rounded-full"
                          title="Online"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <h4 className="font-bold text-lg truncate w-full">
                          {req.firstName} {req.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground w-full truncate">
                          @{req.userName}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider">
                          {new Date(req.createdAt).toLocaleDateString(
                            i18n.language,
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 w-full mt-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-500/20"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              type: "approved",
                              request: req,
                            })
                          }
                        >
                          {t("buttons.approve") || "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive/20 hover:border-destructive transition-colors"
                          size="sm"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              type: "rejected",
                              request: req,
                            })
                          }
                        >
                          {t("buttons.reject") || "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <DataTable columns={COLUMNS} data={users} />
      {/* User Details Modal */}
      {/* User Details Modal */}
      <Modal
        open={!!selectedUser}
        onOpenChange={(val) => !val && setSelectedUser(null)}
        title={t("management.userProfileDetail")}
        description={`${t("management.reviewingParameters")} ${
          selectedUser?.userName
        }`}
        maxWidth="max-w-md"
      >
        {selectedUser && (
          <div className="flex flex-col items-center py-4 px-6 space-y-6">
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
      </Modal>
      {/* Confirmation Dialog */}
      {/* Confirmation Dialog */}
      <Modal
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
        maxWidth="max-w-md"
        title={
          <div className="flex items-center gap-2">
            {confirmDialog.type === "approved" ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-destructive" />
            )}
            {confirmDialog.type === "approved"
              ? t("management.confirmApproveTitle") || "Approve Request?"
              : t("management.confirmRejectTitle") || "Reject Request?"}
          </div>
        }
        description={
          confirmDialog.type === "approved"
            ? t("management.confirmApproveDesc") ||
              `Are you sure you want to approve ${confirmDialog.request?.firstName}'s request to become an organizer?`
            : t("management.confirmRejectDesc") ||
              `Are you sure you want to reject ${confirmDialog.request?.firstName}'s request? This action cannot be undone.`
        }
        footer={
          <div className="flex gap-2 sm:gap-0 justify-end w-full">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
            <Button
              variant={
                confirmDialog.type === "approved" ? "default" : "destructive"
              }
              className={
                confirmDialog.type === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white ml-2"
                  : "ml-2"
              }
              onClick={() => {
                if (confirmDialog.request && confirmDialog.type) {
                  handleRequest.mutate({
                    userId: confirmDialog.request._id,
                    status: confirmDialog.type,
                  });
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }
              }}
            >
              {t("buttons.confirm") || "Confirm"}
            </Button>
          </div>
        }
      >
        {confirmDialog.request?.organizerSummary && (
          <div className="bg-muted/30 p-4 rounded-lg border border-border/40 text-sm italic text-muted-foreground my-2">
            "{confirmDialog.request.organizerSummary}"
          </div>
        )}
      </Modal>
    </div>
  );
}
