import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ items, itemBy, pieTitle , label }) => {
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
        borderColor: colors
          .slice(0, Object.keys(categoryData).length)
          .map((color) => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: pieTitle,
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#374151",
      },
    },
  };

  return (
    <div className="bg-white/80 flex justify-center h-[400px] backdrop-blur-sm border border-slate-200 rounded-xl py-6 shadow-md">
      <Pie data={data} options={options} />
    </div>
  );
};
