import React from "react";
import { useTranslation } from "react-i18next";
import { Construction } from "lucide-react";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";

export default function ComingSoon() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("dashboard.sideBar.myTickets") || "My Tickets"}
        subtitle="Manage your bookings"
      />
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[var(--color-layer-2)] rounded-2xl border border-[var(--color-border-1)] text-center p-8">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          We are working hard to bring you this feature. Check back soon!
        </p>
      </div>
    </div>
  );
}
