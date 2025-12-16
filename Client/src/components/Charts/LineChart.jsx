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

import { useThemeContext } from "../../context/ThemeContext";
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
    const revenue = event.price * (event.capacity - event.availableTickets); ;
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
          color: isDark ? "#e2e8f0" : "#475569",
          font: {
             family: "'Inter', sans-serif",
          }
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b", // slate-400 : slate-500
        },
        grid: {
          color: isDark ? "#334155" : "#e2e8f0", // slate-700 : slate-200
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
        grid: {
           color: isDark ? "#334155" : "#e2e8f0",
        }
      },
    },
  };

  return <Line data={data} options={options} />;
};
