import React, { useState } from "react";
import { CalendarDays, Users, DollarSign } from "lucide-react";
import { PieChart } from "../components/Charts/PieChart";
import { LineChart } from "../components/Charts/LineChart";
import { useEvent } from "../context/EventsContext";

export default function AdminDashboard() {
  const { events } = useEvent();
  const totalEvents = events?.length;
  console.log(totalEvents);
  const totalRevenue = events?.reduce(
    (sum, event) =>
      sum + event.price * (event.capacity - event.availableTickets),
    0
  );
  const totalCapacity = events?.reduce(
    (sum, event) => sum + event.availableTickets,
    0
  );
  const cards = [
    {
      label: "Total Events",
      value: "events",
      icon: <CalendarDays className="w-6 h-6" />,

      color: "purple",
    },
    {
      label: "Revenue Collected",
      value: "revenue",
      icon: <DollarSign className="w-6 h-6" />,

      color: "green",
    },
    {
      label: "Capacity Not Booked",
      value: "capacity",
      icon: <Users className="w-6 h-6" />,

      color: "blue",
    },
  ];

  return (
    <div>
      <div className="h-screen md:h-auto overflow-hidden mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Manage events and track performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={card.label}
              className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 rounded-xl p-6 text-white shadow-md`}
            >
              <div className="flex items-center justify-center  gap-3">
                {card.icon}
                <h3 className="text-xl font-medium opacity-90">{card.label}</h3>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {card.value == "events"
                    ? totalEvents
                    : card.value == "revenue"
                    ? totalRevenue
                    : card.value == "capacity"
                    ? totalCapacity
                    : "0"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-800">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 ">
            <PieChart
              items={events}
              itemBy="category"
              label={"Events"}
              pieTitle={"Events Category Distribution"}
            />
            <LineChart items={events} />
          </div>
          <div className="grid grid-cols-1 gap-6"></div>
        </div>
      </div>
    </div>
  );
}
