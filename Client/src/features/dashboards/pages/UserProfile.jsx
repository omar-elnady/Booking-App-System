import React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@features/auth/store/authStore";
import { Input } from "@/components/ui/input";
import { userDataForm } from "@/constants";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";

export const UserProfile = () => {
  const { t } = useTranslation();
  // const language = i18n.language; // Removed unused variable
  const { user } = useAuthStore();
  const userData = user;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      userName: userData?.userName,
      email: userData?.email,
      phone: userData?.phone,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // console.log("Profile updated:", data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <DashboardPageHeader
        title={t("userForm.title")}
        subtitle={t("userProfile.subtitle")}
      />

      {/* Main Card */}
      <div className="bg-[var(--color-layer-2)] rounded-2xl shadow-sm border border-[var(--color-border-1)] overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userDataForm(t).map((element) => (
                <div key={element.name} className="space-y-2">
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
                    value={userData?.[element.name] || element.value} // Fix: Ensure value is controlled properly or use defaultValues from RHF
                    {...register(element.name, {
                      required: element.required,
                      pattern: element.pattern,
                      minLength: element.minLength,
                      maxLength: element.maxLength,
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  {errors[element.name] && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span>•</span>{" "}
                      {errors[element.name].message ||
                        `${element.label} is invalid`}
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
