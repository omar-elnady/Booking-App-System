import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UserPlus, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getListMenuForRole, tooltipVariants } from "@/config/constants";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@features/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActionMenu from "@/components/common/ActionMenu";

const AuthSection = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const userData = user;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const menuItems =
    isAuthenticated && userData
      ? getListMenuForRole(t, userData.role, logout)
      : [];

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  // Construct items for ActionMenu
  const actionMenuItems = userData
    ? [
        {
          type: "custom",
          content: (
            <div className="flex flex-col space-y-1 py-1 px-2">
              <p className="text-sm font-bold leading-none">
                {userData.userName}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {userData.email}
              </p>
              <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase border border-primary/20 w-fit">
                {userData.role}
              </div>
            </div>
          ),
        },
        { type: "separator" },
        ...menuItems.map((item) => ({
          type: "item",
          label: item.name,
          icon: item.icon,
          onClick: () => {
            if (item.onClick) item.onClick();
            if (item.to) navigate(item.to);
          },
          color: item.icon === LogOut ? "text-destructive" : "",
          className:
            item.icon === LogOut
              ? "text-destructive focus:text-destructive focus:bg-destructive/5"
              : isRtl
              ? "flex-row-reverse"
              : "",
        })),
      ]
    : [];

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated && userData ? (
        // Authenticated
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
                  src={userData.userImage?.secure_url}
                  alt={userData.userName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold ring-1 ring-primary/10 transition-colors">
                  {userData.userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
          items={actionMenuItems}
        />
      ) : (
        // Unauthenticated
        <div className="flex items-center space-x-2">
          {/* Desktop  */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleLoginClick}
              className=""
            >
              {t("navbar.login")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRegisterClick}
              className=""
            >
              {t("navbar.signup")}
            </Button>
          </div>

          {/* Mobile  */}
          <div className="relative group md:hidden">
            <UserPlus
              onClick={handleLoginClick}
              className="h-6 w-6 text-gray-600 cursor-pointer hover:text-mainColor dark:hover:text-indigo-400 transition-colors duration-200"
            />
            <AnimatePresence>
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-textDark shadow-md backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 hidden group-hover:block whitespace-nowrap"
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {t("navbar.login")} / {t("navbar.signup")}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
