import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Search,
  CalendarCheck,
  LayoutDashboard,
  MousePointerClick,
  Menu,
  Sun,
  Moon,
  MoonIcon,
} from "lucide-react";
import Button from "./Button";
import DropdownMenu from "./DropdownMenu";
import { useTranslation } from "react-i18next"; 
import LanguageSwitcher from "./Lang";
import CustomDropdown from "./Combox";

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Get t and i18n
  const isAuthenticated = true;
  const user = { role: "admin", name: "omar" };
  const navigate = useNavigate();

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const languagesOpition = [
    {
      label: t("navbar.en"),
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
      value: "en",
      onClick: () => {
        changeLanguage("en");
      },
    },
    {
      label: t("navbar.ar"),
      img: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg",
      value: "ar",
      onClick: () => {
        changeLanguage("ar");
      },
    },
  ];
  const [lang, setLang] = useState(
    i18n.language
      ? i18n.language == "en"
        ? languagesOpition[0]
        : languagesOpition[1]
      : languagesOpition[0]
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.toggle("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const basicLinks = [
    {
      name: t("navbar.home"),
      to: "/",
    },
    {
      name: t("navbar.events"),
      to: "/events",
    },
  ];

  const listMenuAdmin = [
    {
      name: t("navbar.dashboard"),
      icon: LayoutDashboard,
      to: "/dashboard",
    },
    { name: t("navbar.logout"), icon: LogOut, to: "/sign-in" },
  ];

  return (
    <nav className="bg-white blurred dark:bg-darkNavbar   shadow-lg border-b  transition-colors duration-500 border-gray-600 z-50">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                <MousePointerClick />
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition duration-500">
              {t("navbar.logoName")}
            </span>
          </Link>

          {/* Basic Links */}
          <div className="hidden md:flex items-center space-x-8">
            {basicLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="text-gray-700 dark:text-white hover:text-blue-600 transition-colors duration-400 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Auth, Language Switcher, Menu */}
          <div className="flex items-center space-x-4">
            {/* --- Language Switcher Buttons --- */}
            <div
              className={`hidden md:flex items-center space-x-2 ${
                i18n.language === "en"
                  ? "border-r pr-4 mr-4"
                  : "border-l pl-4 ml-4"
              } border-gray-300 `}
            >
              <CustomDropdown
                value={lang}
                options={languagesOpition}
                setValue={setLang}
              />
            </div>
            <div
              className="relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer"
              onClick={toggleTheme}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                  i18n.language === "ar"
                    ? isDark
                      ? "translate-x-8"
                      : "translate-x-0"
                    : isDark
                    ? "translate-x-0"
                    : "translate-x-8"
                }`}
              >
                {isDark ? (
                  <Moon className="text-gray-300 w-4 h-4" />
                ) : (
                  <Sun className="text-yellow-500 w-4 h-4" />
                )}
              </div>
            </div>
            {/* --- End Language Switcher Buttons --- */}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === "admin" && (
                  <DropdownMenu
                    items={listMenuAdmin}
                    menuName={
                      <div className="flex items-center gap-1">
                        <User /> {user.name.toLocaleUpperCase()}
                      </div>
                    }
                    classMenuBtn={`border-none hidden md:inline-flex`} // Hide on small screens if language switcher is shown
                  />
                )}
                {/* Mobile Menu Button */}
                <DropdownMenu
                  items={[
                    ...basicLinks,
                    {
                      name: "EN",
                      action: () => changeLanguage("en"),
                      isLang: true,
                      langCode: "en",
                    },
                    {
                      name: "AR",
                      action: () => changeLanguage("ar"),
                      isLang: true,
                      langCode: "ar",
                    },
                    ...(user?.role === "admin" ? listMenuAdmin : []), // Add admin links if admin
                  ]}
                  cancelDefultStyle={true}
                  menuName={<Menu />}
                  classMenuBtn={`md:hidden px-1 py-2 rounded shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                  // Custom rendering needed in DropdownMenu to handle 'action' and styling for lang buttons
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-black bg-white hover:bg-gray-100 border border-gray-400 "
                  onClick={() => navigate("/login")}
                >
                  {t("navbar.login")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {t("navbar.signup")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
