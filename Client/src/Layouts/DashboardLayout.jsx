import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/Dashboard/DashboardSidebar";
// import { useTranslation } from "react-i18next";

const DashboardLayout = ({ userType = "admin" }) => {
  // const { i18n } = useTranslation(); // Removed unused variable
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[var(--color-layer-1)] text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <DashboardSidebar
        userType={userType}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <main
        className={`flex-1 transition-all duration-300 w-full min-h-screen ${
          isSidebarOpen ? "md:ms-64" : "md:ms-0"
        }`}
      >
        <div className="p-6 md:p-8 pt-20 max-w-7xl mx-auto">
             <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
