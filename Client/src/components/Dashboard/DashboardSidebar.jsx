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
} from "lucide-react";
import { UserProfile } from "../../pages/UserProfile";
import { PasswordSettings } from "../../pages/PasswordSettings";
import ManageEvents from "../../pages/ManageEvents";

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
    title: "Admin Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Events",
    url: "/manage-events",
    icon: Tickets,
    component: ManageEvents,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    component: UserProfile,
  },
  {
    title: "Security",
    url: "/security",
    icon: Settings,
    component: PasswordSettings,
  },
];

export function DashboardSidebar({
  userType,
  setIsSidebarOpen,
  isSidebarOpen,
}) {
  const location = useLocation();
  const menuItems = userType === "user" ? userMenuItems : adminMenuItems;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex   ">
      <PanelLeft
        className={`cursor-pointer rounded-lg absolute top-4 ${
          isSidebarOpen ? "left-70" : "left-6"
        } transition-all duration-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "left-0" : "-left-64"
        }  w-64 bg-white/80 overflow-hidden backdrop-blur-sm border-r border-slate-200 transition-all duration-300 flex flex-col h-screen fixed`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {userType === "user" ? "User Portal" : "Admin Portal"}
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className={`text-sm font-medium text-slate-600 mb-2 `}>
              Navigation
            </h3>
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
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
