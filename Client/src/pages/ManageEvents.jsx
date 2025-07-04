import React, { useState } from "react";
import NavigateManagemants from "../components/Dashboard/NavigateManagemants";
import { EventSingleForm } from "../components/Dashboard/EventSingleForm";
import AdminDashboard from "./AdminDashboard";
import { EventMultiForm } from "../components/Dashboard/EventMultiForm";
import ManageCategories from "../components/Dashboard/ManageCategories";

function ManageEvents() {
  const [activeTab, setActiveTab] = useState("singleEvent");
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
        return (
          <ManageCategories 
          // categories={categories}
           />
          // <CategoryManager
          //   categories={categories}
          //   onAdd={addCategory}
          //   onUpdate={updateCategory}
          //   onDelete={deleteCategory}
          // />
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Management Categories
        </h1>
        <p className="text-slate-600">Manage events and track performance</p>
      </div>
      <NavigateManagemants activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-5">{renderActiveTab()}</div>
    </div>
  );
}

export default ManageEvents;
