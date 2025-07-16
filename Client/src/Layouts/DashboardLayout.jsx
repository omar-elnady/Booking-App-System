import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/Dashboard/DashboardSidebar";
import { useTranslation } from "react-i18next";

const DashboardLayout = ({ userType = "admin" }) => {
  const { i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen  ">
      <DashboardSidebar
        userType={userType}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <main
        className={`flex-1  transition-all duration-300 ${
          isSidebarOpen && i18n.language === "en" ? " md:ml-64 " : " md:ml-0 "
        }${isSidebarOpen && i18n.language === "ar" ? " md:mr-64 " : " md:mr-0 "} p-6 `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
