import React, { useState } from "react";
import Button from "../Button";
import { bothLanguageEventForm } from "../../constants";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Input from "../Input";

export function EventMultiForm({ onEventAdded, categories }) {
  const { t, i18n } = useTranslation();
  const languageSystem = i18n.language == "en" ? "En" : "Ar";

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
      !formData.name_ar ||
      !formData.name_en ||
      !formData.category ||
      !formData.date ||
      !formData.price
    ) {
      setToast({
        title: "Error",
        description:
          "Please fill in all required fields for the selected language(s).",
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
      title: "Success",
      description: "Event added successfully!",
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

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
            toast.variant === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <h3 className="text-sm font-semibold">{toast.title}</h3>
          <p className="text-sm">{toast.description}</p>
        </div>
      )}

      {/* Form Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">Add New Event</h2>
      </div>

      {/* Language Mode Toggle */}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bothLanguageEventForm(languageSystem, t).map((element) => (
            <div key={element.id}>
              <label
                htmlFor={element.id}
                className="block text-sm font-medium text-gray-700
              dark:text-gray-700 
                 mb-1"
              >
                {element.label}
              </label>
              <Input
                id={element.id}
                type={element.type}
                placeholder={element.placeholder}
                {...register(element.name, {
                  required: element.required,
                  pattern: element.pattern,
                  minLength: element.minLength,
                  maxLength: element.maxLength,
                })}
                className="py-2"
              />
              {errors[element.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[element.name].message ||
                    `${element.label} is invalid`}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-slate-700"
            >
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add Event
        </Button>
      </form>
    </div>
  );
}
