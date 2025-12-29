import React from "react";
import {
  CalendarDays,
  Users,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react";
import { PieChart } from "../components/Charts/PieChart";
import { LineChart } from "../components/Charts/LineChart";
import { useEvents } from "@/hooks/useEvents";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  // Fetching a larger limit to get better stats estimate, though ideally backend should provide stats endpoint
  const { data, isLoading } = useEvents({ limit: 100 });
  const events = data?.events || [];

  const totalEvents = events.length || 0;

  const totalRevenue =
    events.reduce(
      (sum, event) =>
        sum + event.price * (event.capacity - event.availableTickets),
      0
    ) || 0;

  const totalCapacity =
    events.reduce((sum, event) => sum + event.availableTickets, 0) || 0;

  const cards = [
    {
      label: t("adminDashboard.totalEvents"),
      value: totalEvents,
      icon: <CalendarDays className="w-6 h-6" />,
      color: "purple",
      bg: "bg-purple-500",
      darkBg: "dark:bg-purple-600",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: t("adminDashboard.revenueCollected"),
      value: `${totalRevenue.toLocaleString()} ${t("currency")}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "emerald",
      bg: "bg-emerald-500",
      darkBg: "dark:bg-emerald-600",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: t("adminDashboard.availableCapacity"),
      value: totalCapacity,
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      bg: "bg-blue-500",
      darkBg: "dark:bg-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: t("adminDashboard.activeBookings"),
      value:
        events.reduce(
          (acc, curr) => acc + (curr.capacity - curr.availableTickets),
          0
        ) || 0,
      icon: <Activity className="w-6 h-6" />,
      color: "orange",
      bg: "bg-orange-500",
      darkBg: "dark:bg-orange-600",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={t("adminDashboard.overview")}
        subtitle={t("adminDashboard.overviewSubtitle")}
      >
        <span className="px-3 py-1 bg-[var(--color-layer-2)] border border-[var(--color-border-1)] rounded-lg text-sm font-medium text-slate-600 dark:text-slate-200 shadow-sm">
          {t("adminDashboard.last30Days")}
        </span>
      </DashboardPageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--color-layer-2)] rounded-2xl p-6 shadow-sm border border-[var(--color-border-1)] transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-${card.color}-500/20`}
              >
                {card.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 dark:text-${card.color}-400`}
              >
                +2.5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                {card.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Card */}
        <div className="bg-[var(--color-layer-2)] rounded-2xl p-6 shadow-sm border border-[var(--color-border-1)]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">
            {t("adminDashboard.categoriesDistribution")}
          </h3>
          <div className="h-[300px] w-full relative">
            <PieChart
              items={events}
              itemBy="category"
              label={t("events.evnets")}
              pieTitle={t("adminDashboard.categoriesDistribution")}
            />
          </div>
        </div>

        {/* Line Chart Card */}
        <div className="bg-[var(--color-layer-2)] rounded-2xl p-6 shadow-sm border border-[var(--color-border-1)]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">
            {t("adminDashboard.revenueTrends")}
          </h3>
          <div className="h-[300px] w-full">
            <LineChart items={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
