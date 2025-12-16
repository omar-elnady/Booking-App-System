import { Calendar, LayoutDashboard, Ticket } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import TitleSection from "./TitleSection";

function Features() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Ticket,
      title: t("features.ticketManagement.title"),
      desc: t("features.ticketManagement.description"),
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Calendar,
      title: t("features.eventOrganization.title"),
      desc: t("features.eventOrganization.description"),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: LayoutDashboard,
      title: t("features.analyticsDashboard.title"),
      desc: t("features.analyticsDashboard.description"),
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
      <TitleSection title={t("features.title")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="text-center space-y-4 p-6 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group"
          >
            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110`}>
              <feature.icon className={`h-7 w-7 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
