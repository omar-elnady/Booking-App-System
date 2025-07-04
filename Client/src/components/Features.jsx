import { Calendar, LayoutDashboard, Ticket } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import TitleSection from "./TitleSection";

function Features() {
  const { t } = useTranslation();
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
      <TitleSection title={t("Key Features")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
            <Ticket className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Ticket Management</h3>
          <p className="text-sm text-slate-600">
            Comprehensive ticket tracking with status updates and detailed
            information.
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Event Organization</h3>
          <p className="text-sm text-slate-600">
            Organize events by categories with detailed scheduling and venue
            management.
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
            <LayoutDashboard className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Analytics Dashboard</h3>
          <p className="text-sm text-slate-600">
            Track performance metrics, revenue projections, and capacity
            utilization.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
