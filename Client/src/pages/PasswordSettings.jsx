import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// import { useAuth } from "../context/UserContext";
import { changePassword } from "../constants";
import Input from "../components/Input";
import Button from "../components/Button";
import { DashboardPageHeader } from "../components/Dashboard/DashboardPageHeader";

export const PasswordSettings = () => {
  const { t } = useTranslation();
  // const language = i18n.language; // Unused
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Password updated:", data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <DashboardPageHeader 
        title={t("changePassword.title")} 
        subtitle={t("passwordSettings.subtitle")}
      />

      <div className="bg-[var(--color-layer-2)] rounded-2xl shadow-sm border border-[var(--color-border-1)] overflow-hidden">
        
        {/* Info Banner */}
        <div className="px-6 md:px-8 pt-6">
           <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-700/50 flex gap-3">
              <div className="shrink-0 text-blue-600 dark:text-blue-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                {t("changePassword.description")}
              </p>
           </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-w-2xl space-y-4">
              {changePassword(t, getValues).map((element) => (
                <div
                  key={element.name}
                  className="space-y-2"
                >
                  <label
                    htmlFor={element.name}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
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
                      validate: element.validate,
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  {errors[element.name] && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span>•</span> {errors[element.name].message || `${element.label} is invalid`}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-600 flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 font-medium"
              >
                {t("saveChanges")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
