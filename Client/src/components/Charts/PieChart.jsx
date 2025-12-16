import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
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
          color: isDark ? "#e2e8f0" : "#475569", // slate-200 : slate-600
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      title: {
        display: false,
      },
    },
  };

  return <Pie data={data} options={options} />;
};
