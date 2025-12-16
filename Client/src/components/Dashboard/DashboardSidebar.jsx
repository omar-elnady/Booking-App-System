import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Ticket,
  Tickets,
  User,
  Settings,
  PanelLeft,
  House,
  ChartNoAxesCombinedIcon,
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Sun
} from "lucide-react";
import { UserProfile } from "../../pages/UserProfile";
import { PasswordSettings } from "../../pages/PasswordSettings";
import ManageEvents from "../../pages/ManageEvents";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/UserContext"; 
import { useTheme } from "../../hooks/useTheme";

export function DashboardSidebar({
  userType,
  setIsSidebarOpen,
  isSidebarOpen,
}) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { userData } = useAuth(); // Get user info for the bottom card
  const location = useLocation();

  const userMenuItems = [
    {
      title: "My Tickets",
      url: "/user-dashboard",
      icon: Ticket,
    },
    {
      title: "Profile",
      url: "/user-profile",
      icon: User,
      component: UserProfile,
    },
    {
      title: "Security",
      url: "/user-security",
      icon: Settings,
      component: PasswordSettings,
    },
  ];

  const adminMenuItems = [
    {
      title: t("dashboard.sideBar.adminDashboard"),
      url: "/dashboard",
      icon: ChartNoAxesCombinedIcon,
    },
    {
      title: t("dashboard.sideBar.magageEvents"),
      url: "/manage-events",
      icon: Tickets,
      component: ManageEvents,
    },
    {
      title: t("dashboard.sideBar.profileSettings"),
      url: "/profile",
      icon: User,
      component: UserProfile,
    },
    {
      title: t("dashboard.sideBar.changePassword"),
      url: "/security",
      icon: Settings,
      component: PasswordSettings,
    },
  ];
 
  const menuItems = userType === "user" ? userMenuItems : adminMenuItems;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button (Floating) */}
      <button
        className={`fixed top-6 z-[99999999] p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-200 hover:text-blue-600 transition-all duration-300
          ${isSidebarOpen ? "start-52" : "start-4"}
        `}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <PanelLeft className={`w-5 h-5 ${!isSidebarOpen && "rotate-180"}`} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 start-0 z-50 w-64 bg-[var(--color-layer-2)] border-e border-[var(--color-border-1)] shadow-2xl md:shadow-none transition-transform duration-300 flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                D
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 truncate">
               {t("navbar.logoName")}
              </h2>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          <div>
             <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("dashboard.sideBar.menuLabel")}
             </p>
             <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                      className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                    </Link>
                  </li>
                );
              })}
             </ul>
          </div>

          <div>
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("dashboard.sideBar.systemLabel")}
             </p>
             <ul className="space-y-1">
                {/* Theme Toggle in Sidebar */}
                <li>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <span className="font-medium text-sm">{t("dashboard.sideBar.theme")}</span>
                    </div>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">
                      {isDark ? t("dashboard.sideBar.dark") : t("dashboard.sideBar.light")}
                    </span>
                  </button>
                </li>

                {/* Language Toggle in Sidebar */}
                <li>
                  <button
                     onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
                     className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
                  >
                     <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5" />
                        <span className="font-medium text-sm">{t("dashboard.sideBar.language")}</span>
                     </div>
                     <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300 uppercase">
                        {i18n.language === "en" ? t("dashboard.sideBar.english") : t("dashboard.sideBar.arabic")}
                     </span>
                  </button>
                </li>

                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group"
                  >
                    <House className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600" />
                    <span className="font-medium text-sm">{t("dashboard.sideBar.returnHome")}</span>
                  </Link>
                </li>
             </ul>
          </div>
        </nav>

        {/* User Snippet Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                  {userData?.firstName?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {userData?.firstName || "User"} {userData?.lastName || ""}
                 </p>
                 <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {userData?.email || "user@example.com"}
                 </p>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors">
                 <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </>
  );
}
