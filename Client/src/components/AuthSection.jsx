import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { getListMenuForRole, tooltipVariants } from "@/constants";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@features/auth/store/authStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthSection = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const userData = user;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems =
    isAuthenticated && userData
      ? getListMenuForRole(t, userData.role, logout)
      : [];

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated ? (
        // Authenticated
        // Authenticated
        userData && (
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full md:w-auto md:rounded-md px-2"
                >
                  <span className="md:hidden">
                    <User className="h-5 w-5" />
                  </span>
                  <span className="hidden md:flex items-center gap-1 font-medium">
                    {userData.userName?.toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {menuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      if (item.to) navigate(item.to);
                    }}
                    className="cursor-pointer gap-2"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
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
                className="absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-textDark shadow-md backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 hidden group-hover:block whitespace-nowrap" // Added whitespace-nowrap
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
