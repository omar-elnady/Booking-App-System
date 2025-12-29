import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { getRegisterForm, registerDefult } from "@/constants";
import { YouAlreadyHaveAccount } from "./SignSections";
import { useTranslation } from "react-i18next";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

const SignUp = ({ setIsLogin }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...registerDefult,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/register`, data);

      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          setIsLogin(true);
        }, 100);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-5 md:px-10 dark:bg-black">
      <div className="lg:w-5/6 w-full bg-white dark:bg-gray-900/70 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5 text-center">
          {t("login.signup")}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              i18n.language === "ar" ? "pl-3" : "pr-3"
            } `}
          >
            {getRegisterForm(t).map((element) => (
              <div
                key={element.name}
                className={`flex flex-col gap-3 ${
                  element.name === "firstName" || element.name === "lastName"
                    ? "col-span-1"
                    : "col-span-1 md:col-span-2"
                }`}
              >
                <label
                  htmlFor={element.name}
                  className=" text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                {errors[element.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[element.name].message ||
                      `${element.label} is invalid`}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-lg text-white"
          >
            {isLoading ? t("login.signingUp") + "..." : t("login.signup")}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <YouAlreadyHaveAccount setIsLogin={setIsLogin} t={t} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
