import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useThemeContext } from "@app/providers/ThemeContext";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChart = ({ items }) => {
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyRevenue = items.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const month = eventDate.getMonth();
    const revenue = event.price * (event.capacity - event.availableTickets);
    acc[month] = (acc[month] || 0) + revenue;
    return acc;
  }, {});

  const data = {
    labels: months,
    datasets: [
      {
        label: t("adminDashboard.revenueTrends"),
        data: months.map((_, index) => monthlyRevenue[index] || 0),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#1d4ed8",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#f8fafc" : "#334155",
          font: {
            family: "'Inter', sans-serif",
            weight: "600",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#f8fafc" : "#1e293b",
        bodyColor: isDark ? "#cbd5e1" : "#475569",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: { family: "'Inter', sans-serif" },
        },
        grid: {
          color: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: { family: "'Inter', sans-serif" },
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
        grid: {
          color: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.5)",
        },
      },
    },
  };

  return <Line key={isDark ? "dark" : "light"} data={data} options={options} />;
};
