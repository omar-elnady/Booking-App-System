import React, { useState } from "react";
import Button from "../Button";
import { singleLanguageEventForm } from "../../constants";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Input from "../Input";

export function EventSingleForm({ onEventAdded, categories }) {
  const { t } = useTranslation();
  const [languageMode, setLanguageMode] = useState("En");
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    date: "",
    time: "",
    venue_ar: "",
    venue_en: "",
    category: "",
    price: "",
    capacity: "",
  });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation based on language mode
    if (
      (languageMode === "ar" &&
        (!formData.name_ar ||
          !formData.category ||
          !formData.date ||
          !formData.price)) ||
      (languageMode === "en" &&
        (!formData.name_en ||
          !formData.category ||
          !formData.date ||
          !formData.price))
    ) {
      setToast({
        title: t("common.error"),
        description: t("common.fillAllFields"),
        variant: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      name: {
        ar: formData.name_ar,
        en: formData.name_en,
      },
      description: {
        ar: formData.description_ar,
        en: formData.description_en,
      },
      date: formData.date,
      time: formData.time,
      venue: {
        ar: formData.venue_ar,
        en: formData.venue_en,
      },
      category: formData.category,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity) || 100,
    };

    onEventAdded(newEvent);
    setFormData({
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      date: "",
      time: "",
      venue_ar: "",
      venue_en: "",
      category: "",
      price: "",
      capacity: "",
    });

    setToast({
      title: t("common.success"),
      description: t("common.eventAdded"),
      variant: "success",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...formData,
    },
  });

  const languageModes = [
    { value: "En", label: "English" },
    { value: "Ar", label: "Arabic" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md animate-in slide-in-from-right-5 duration-300 flex items-center gap-3 ${
            toast.variant === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200"
              : "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${toast.variant === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
          <div>
             <h3 className="text-sm font-semibold">{toast.title}</h3>
             <p className="text-xs opacity-90">{toast.description}</p>
          </div>
        </div>
      )}

      {/* Language Mode Toggle */}
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t("manageEvents.eventDetails")}
         </h2>
         <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          {languageModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setLanguageMode(mode.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                languageMode === mode.value
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {mode.label == "English" ? t("navbar.en") : t("navbar.ar")}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {singleLanguageEventForm(languageMode, t).map((element) => (
            <div key={element.name} className="space-y-1.5">
              <label
                htmlFor={element.name}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {element.label}
              </label>
              <Input
                id={element.name}
                type={element.type}
                placeholder={element.placeholder}
                {...register(element.name, {
                  required: element.required,
                  pattern: element.pattern,
                  minLength: element.minLength,
                  maxLength: element.maxLength,
                })}
                className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {errors[element.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[element.name].message || `${element.label} ${t("common.invalid")}`}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t("manageEvents.categoryLabel")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-layer-2)] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-900 dark:text-white appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="text-slate-400">
                  {t("manageEvents.selectCategory")}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category} className="dark:bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            {t("manageEvents.createEvent")}
          </Button>
        </div>
      </form>
    </div>
  );
}
