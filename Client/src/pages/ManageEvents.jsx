import React, { useState } from "react";
import NavigateManagemants from "../components/Dashboard/NavigateManagemants";
import { EventSingleForm } from "../components/Dashboard/EventSingleForm";
import AdminDashboard from "./AdminDashboard";
import { EventMultiForm } from "../components/Dashboard/EventMultiForm";
import ManageCategories from "../components/Dashboard/ManageCategories";
import { DashboardPageHeader } from "../components/Dashboard/DashboardPageHeader";
// import { Calendar, Layers, LayoutGrid } from "lucide-react";
// Actually, let's just delete them if unused.
// But wait, the previous turn added them. I will comment them out or remove.

import { useTranslation } from "react-i18next";

function ManageEvents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("categories");
  
  // Categories list could be fetched from API later
  const categories = [
    "Music & Concerts",
    "Technology",
    "Sports",
    "Arts & Theater",
    "Food & Drink",
    "Business",
    "Health & Wellness",
    "Education",
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "singleEvent":
        return <EventSingleForm categories={categories} />;
      case "multiLanguageEvent":
        return <EventMultiForm categories={categories} />;
      case "categories":
        return <ManageCategories />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t("manageEvents.title")}
        subtitle={t("manageEvents.subtitle")}
      />

      <div className="bg-[var(--color-layer-2)] rounded-2xl shadow-sm border border-[var(--color-border-1)] min-h-[600px] flex flex-col">
        <div className="p-6 border-b border-[var(--color-border-1)]">
           <NavigateManagemants activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="p-8 flex-1">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default ManageEvents;
