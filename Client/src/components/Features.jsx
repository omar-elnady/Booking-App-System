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
      color: "text-black dark:text-white",
      bg: "bg-white dark:bg-black border border-gray-300 dark:border-gray-700",
    },
    {
      icon: Calendar,
      title: t("features.eventOrganization.title"),
      desc: t("features.eventOrganization.description"),
      color: "text-black dark:text-white",
      bg: "bg-white dark:bg-black border border-gray-300 dark:border-gray-700",
    },
    {
      icon: LayoutDashboard,
      title: t("features.analyticsDashboard.title"),
      desc: t("features.analyticsDashboard.description"),
      color: "text-black dark:text-white",
      bg: "bg-white dark:bg-black border border-gray-300 dark:border-gray-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-black border mt-10 border-gray-200 dark:border-gray-900  rounded-lg p-8">
        <TitleSection title={t("features.title")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-6 rounded-2xl hover:opacity-80 transition-all duration-300 group dark:bg-gray-900/40 bg-gray-100"
            >
              <div
                className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
