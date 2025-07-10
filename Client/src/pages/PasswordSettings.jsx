import React from "react";
import { useForm } from "react-hook-form";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/UserContext";
import { changePassword } from "../constants";
import Input from "../components/Input";

const PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const PasswordSettings = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { userToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues ,
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
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Change Password
        </h1>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"></h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            For security reasons, you need to enter your current password to
            change it.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {changePassword(t , getValues).map((element) => (
              <div
                key={element.name}
                className={`${language === "ar" ? "text-right" : "text-left"}`}
              >
                <label
                  htmlFor={element.name}
                  className="block text-sm font-medium text-gray-700
              dark:text-gray-700 
                 mb-1"
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
                  className="py-2 text-gray-900 dark:text-gray-800"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Save Edits
          </button>
        </form>
      </div>
    </>
  );
};
