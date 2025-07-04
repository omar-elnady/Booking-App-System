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
        label: "Projected Revenue (EGP)",
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
      },
      title: {
        display: true,
        text: "Monthly Projected Revenue",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};
