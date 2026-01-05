import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl" || i18n.language === "ar";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 border-none"
    >
      {/* Premium Sliding Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-30 hidden flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:flex",
          isRtl ? "right-0" : "left-0",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <DashboardSidebar
          isCollapsed={isSidebarCollapsed}
          className="bg-neutral-50 dark:bg-neutral-950 border-none h-full"
        />
      </aside>

      {/* Main Content Area*/}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-2 border-border rounded-2xl bg-background min-w-0",
          isRtl
            ? isSidebarCollapsed
              ? "md:mr-20 ml-2 my-2"
              : "md:mr-64 ml-2 my-2"
            : isSidebarCollapsed
            ? "md:ml-20 mr-2 my-2"
            : "md:ml-64 mr-2 my-2"
        )}
      >
        <DashboardHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-10 overflow-x-auto">
          <div className="mx-auto max-w-7xl relative pb-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out fill-mode-both">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
