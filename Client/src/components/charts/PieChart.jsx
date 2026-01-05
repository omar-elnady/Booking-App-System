import React from "react";
import { useThemeContext } from "@app/providers/ThemeContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ items, itemBy, label }) => {
  const { isDark } = useThemeContext();
  const categoryData = items.reduce((acc, item) => {
    acc[item[itemBy]] = (acc[item[itemBy]] || 0) + 1;
    return acc;
  }, {});

  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#dc2626",
    "#ea580c",
    "#0891b2",
  ];

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: `${label} Distribution`,
        data: Object.values(categoryData),
        backgroundColor: colors.slice(0, Object.keys(categoryData).length),
        borderColor: isDark ? "#171717" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#f8fafc" : "#334155",
          font: {
            family: "'Inter', sans-serif",
            weight: "600",
            size: 11,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
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
  };

  return <Pie key={isDark ? "dark" : "light"} data={data} options={options} />;
};
