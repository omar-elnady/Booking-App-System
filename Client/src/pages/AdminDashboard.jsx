import React, { useState } from "react";
import { CalendarDays, Users, DollarSign } from "lucide-react";
import { PieChart } from "../components/Charts/PieChart";
import { LineChart } from "../components/Charts/LineChart";
import { useEvent } from "../context/EventsContext";

export default function AdminDashboard() {
  const { events } = useEvent();
  const totalEvents = events.length;
  const totalRevenue = events.reduce(
    (sum, event) => sum + event.price * (event.capacity - event.availableTickets) ,
    0
  );
  const totalCapacity = events.reduce((sum, event) => sum + event.availableTickets, 0);
console.log(events[0]?.availableTickets)
  return (
    <div>
      <div className="space-y-8  mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Manage events and track performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6" />
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Events</h3>
                <p className="text-2xl font-bold">{totalEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6" />
              <div>
                <h3 className="text-sm font-medium opacity-90">
                   Revenue of booked tickets
                </h3>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div>
                <h3 className="text-sm font-medium opacity-90">
                  Total Capacity Not Booked
                </h3>
                <p className="text-2xl font-bold">{totalCapacity}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Charts Section */}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Analytics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 mb-6">
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
