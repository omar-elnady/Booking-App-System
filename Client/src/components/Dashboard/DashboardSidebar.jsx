import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Tickets,
  User,
  Settings,
  PanelLeft,
  List,
  House,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import { UserProfile } from "../../pages/UserProfile";
import { PasswordSettings } from "../../pages/PasswordSettings";
import ManageEvents from "../../pages/ManageEvents";
import { useTranslation } from "react-i18next";

export function DashboardSidebar({
  userType,
  setIsSidebarOpen,
  isSidebarOpen,
}) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
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
    // {
    //   title: t("dashboard.sideBar.goBack"),
    //   url: "/",
    //   icon: House,
    // },
  ];
 
  const location = useLocation();
  const menuItems = userType === "user" ? userMenuItems : adminMenuItems;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex   ">
      <PanelLeft
        className={`cursor-pointer rounded-lg absolute top-4 ${
          isSidebarOpen && language === "en" ? "left-70" : "left-6" 
        } ${isSidebarOpen && language === "ar" ? "right-70" : "right-6"} transition-all duration-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen && language === "en" ? "left-0" : "-left-64"
        } ${isSidebarOpen && language === "ar" ? "right-0" : "-right-64"} w-64 bg-white/80 overflow-hidden backdrop-blur-sm border-r border-slate-200 transition-all duration-300 flex flex-col h-screen fixed`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {userType === "user" ? "User Portal" : t("dashboard.adminTitle")}
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4">
         
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                      location.pathname === item.url
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/"
                  className={`mt-4 flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                    location.pathname === "/"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <House className="h-4 w-4" />
                  <span className="font-medium">{t("dashboard.sideBar.goBack")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
