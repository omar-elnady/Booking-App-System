import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/Dashboard/DashboardSidebar";

const DashboardLayout = ({ userType = "admin" }) => {
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
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } p-6 `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
