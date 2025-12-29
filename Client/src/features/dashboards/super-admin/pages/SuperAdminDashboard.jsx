import React from "react";
import {
  Users,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStats, useAdminCharts } from "../hooks/useAdmin";
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

export default function SuperAdminDashboard() {
  const { t } = useTranslation();
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: chartsData, isLoading: chartsLoading } = useAdminCharts();
  const { isDark } = useThemeContext();

  if (statsLoading || chartsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: t("superAdmin.totalUsers"),
      key: "totalUsers",
      value: statsData?.stats?.totalUsers || "0",
      icon: Users,
      trend: t("superAdmin.usersSubtitle"),
    },
    {
      title: t("superAdmin.totalEvents"),
      key: "totalEvents",
      value: statsData?.stats?.totalEvents || "0",
      icon: Calendar,
      trend: t("superAdmin.eventsSubtitle"),
    },
    {
      title: t("superAdmin.totalBookings"),
      key: "totalBookings",
      value: statsData?.stats?.totalBookings || "0",
      icon: Ticket,
      trend: t("superAdmin.bookingsSubtitle"),
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

  // Chart Data preparation
  const lineData = {
    labels:
      chartsData?.data?.monthlyBookings.map(
        (b) => `${b._id.month}/${b._id.year}`
      ) || [],
    datasets: [
      {
        label: t("superAdmin.totalBookings"),
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
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
        },
        grid: {
          color: isDark ? "#334155" : "#e2e8f0",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
        },
        grid: {
          color: isDark ? "#334155" : "#e2e8f0",
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.adminTitle")}
        </h1>
        <p className="text-muted-foreground font-medium">
          {t("dashboard.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              {t("superAdmin.totalBookings")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("superAdmin.bookingsSubtitle")}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border shadow-lg col-span-2 bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {" "}
              {t("superAdmin.quickActions")}{" "}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button
              className="h-20 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to="/super-admin/users">
                <Users className="h-6 w-6" /> {t("superAdmin.manageUsers")}
              </Link>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to="/super-admin/events">
                <Calendar className="h-6 w-6" /> {t("superAdmin.manageEvents")}
              </Link>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
              asChild
            >
              <Link to="/super-admin/bookings">
                <Ticket className="h-6 w-6" /> {t("superAdmin.manageBookings")}
              </Link>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 font-bold text-md rounded-2xl"
              variant="outline"
            >
              <Activity className="h-6 w-6" /> {t("superAdmin.transactions")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {" "}
              {t("superAdmin.systemHealth")}{" "}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted-foreground">
                  {t("superAdmin.backendApi")}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  {t("superAdmin.online")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted-foreground">
                  {t("superAdmin.database")}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  {t("superAdmin.connected")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted-foreground">
                  {t("superAdmin.gateway")}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  {t("superAdmin.live")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
