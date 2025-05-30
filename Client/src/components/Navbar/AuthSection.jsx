import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button";
import DropdownMenu from "../DropdownMenu";
import { getListMenuAdmin, tooltipVariants } from "../../constants";
import { useTranslation } from "react-i18next";

const MOCK_IS_AUTHENTICATED = false;
const MOCK_USER = { role: "admin", name: "omar" };

const AuthSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isAuthenticated = MOCK_IS_AUTHENTICATED;
  const user = MOCK_USER;

  const listMenuAdmin = getListMenuAdmin(t);

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated ? (
        // Authenticated
        user?.role === "admin" && (
          <div className="flex">
            <DropdownMenu
              items={listMenuAdmin}
              menuName={
                <div className="flex items-center gap-1 text-gray-700 ">
                  <User /> {user.name.toLocaleUpperCase()}
                </div>
              }
              classMenuBtn="border-none inline-flex"
            />
          </div>
        )
      ) : (
        // Unauthenticated
        <div className="flex items-center space-x-2">
          {/* Desktop  */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginClick}
              className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t("navbar.login")}
            </Button>
            <Button
              size="sm"
              onClick={handleRegisterClick}
              className="bg-mainColor hover:bg-indigo-700 text-white"
            >
              {t("navbar.signup")}
            </Button>
          </div>

          {/* Mobile  */}
          <div className="relative group md:hidden">
            <UserPlus
              onClick={handleLoginClick}
              className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-mainColor dark:hover:text-indigo-400 transition-colors duration-200"
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
