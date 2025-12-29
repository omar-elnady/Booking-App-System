import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/DashboardPageHeader";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const PasswordSettings = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiClient.patch("/auth/changePassword", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(
        t("messages.passwordChangedSuccessfully") ||
          "Password changed successfully"
      );
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              {t("changePassword.description")}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("auth.password") || "Current Password"}
                </label>
                <Input
                  type="password"
                  {...register("oldPassword", {
                    required: "Current password is required",
                  })}
                  className="w-full"
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("auth.newPassword") || "New Password"}
                </label>
                <Input
                  type="password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className="w-full"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("auth.confirmPassword") || "Confirm Password"}
                </label>
                <Input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (val) =>
                      val === newPassword || "Passwords do not match",
                  })}
                  className="w-full"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-600 flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("saveChanges")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
