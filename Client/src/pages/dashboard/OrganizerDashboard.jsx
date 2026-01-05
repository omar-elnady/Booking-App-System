import React from "react";
import {
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStats, useAdminCharts } from "@/hooks/useAdmin";
import { useThemeContext } from "@app/providers/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getDashboardRoute } from "@/lib/roles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function OrganizerDashboard() {
  const { t } = useTranslation();
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: chartsData, isLoading: chartsLoading } = useAdminCharts();
  const { isDark } = useThemeContext();
  const { user } = useAuthStore();
  const dashboardPrefix = getDashboardRoute(user?.role);

  if (statsLoading || chartsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Organizer sees standard stats but theoretically filtered by backend
  const stats = [
    {
      title: t("management.events"),
      key: "totalEvents",
      value: statsData?.stats?.totalEvents || "0",
      icon: Calendar,
      trend: t("management.eventsSubtitle"),
    },
    {
      title: t("management.bookings"),
      key: "totalBookings",
      value: statsData?.stats?.totalBookings || "0",
      icon: Ticket,
      trend: t("management.bookingsSubtitle"),
    },
    {
      title: t("superAdmin.totalRevenue"),
      key: "totalRevenue",
      value: `${statsData?.stats?.totalRevenue || 0} ${t(
        "dashboard.currency"
      )}`,
      icon: DollarSign,
      trend: t("superAdmin.transactionsSubtitle"),
    },
  ];

  const lineData = {
    labels:
      chartsData?.data?.monthlyBookings.map(
        (b) => `${b._id.month}/${b._id.year}`
      ) || [],
    datasets: [
      {
        label: t("management.bookings"),
        data: chartsData?.data?.monthlyBookings.map((b) => b.count) || [],
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: chartsData?.data?.revenueByEvent.map((e) => e.name) || [],
    datasets: [
      {
        label: `${t("superAdmin.totalRevenue")} (${t("dashboard.currency")})`,
        data: chartsData?.data?.revenueByEvent.map((e) => e.revenue) || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const commonOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDark ? "#e2e8f0" : "#475569",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#f8fafc" : "#1e293b",
        bodyColor: isDark ? "#cbd5e1" : "#475569",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#94a3b8" : "#64748b" },
        grid: { color: isDark ? "#334155" : "#e2e8f0" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDark ? "#94a3b8" : "#64748b" },
        grid: { color: isDark ? "#334155" : "#e2e8f0" },
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("organizerDashboard.title")}
        </h1>
        <p className="text-muted-foreground font-medium">
          {t("organizerDashboard.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.key}
              className="border border-border shadow-md bg-background transition-transform hover:scale-[1.02]"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tighter">
                  {stat.value}
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-border shadow-lg bg-background ">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t("management.bookings")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("management.bookingsSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              key={isDark ? "dark-line" : "light-line"}
              data={lineData}
              options={commonOptions}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3 border border-border shadow-lg bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t("superAdmin.totalRevenue")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("superAdmin.transactionsSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              key={isDark ? "dark-bar" : "light-bar"}
              data={barData}
              options={commonOptions}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Organizer */}
      <div className="grid grid-cols-1">
        <Card className="border border-border shadow-lg bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t("superAdmin.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <Button
              className="h-24 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to={`${dashboardPrefix}/events`}>
                <Plus className="h-6 w-6" /> Create New Event
              </Link>
            </Button>
            <Button
              className="h-24 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to={`${dashboardPrefix}/events`}>
                <Calendar className="h-6 w-6" /> {t("management.events")}
              </Link>
            </Button>
            <Button
              className="h-24 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to={`${dashboardPrefix}/bookings`}>
                <Ticket className="h-6 w-6" /> {t("management.bookings")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
