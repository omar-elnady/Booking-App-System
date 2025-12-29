import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 border-none">
      {/* Premium Sliding Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-30 hidden flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:flex",
          isRtl ? "right-0" : "left-0",
          isSidebarCollapsed
            ? isRtl
              ? "translate-x-full"
              : "-translate-x-full"
            : "translate-x-0",
          "w-64"
        )}
      >
        <DashboardSidebar
          isCollapsed={false}
          className="bg-neutral-50 dark:bg-neutral-900 border-none h-full"
        />
      </aside>

      {/* Main Content Area*/}
      <div
        className={cn(
          "flex flex-col flex-1 transition-[margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]  m-auto border-2 border-border rounded-2xl bg-background",
          isRtl
            ? isSidebarCollapsed
              ? "md:mr-2 ml-2 my-2"
              : "md:mr-[16.5rem] ml-2 my-2"
            : isSidebarCollapsed
            ? "md:ml-2 mr-2 my-2"
            : "md:ml-[16.5rem] mr-2 my-2"
        )}
      >
        <DashboardHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-10 overflow-x-hidden">
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
