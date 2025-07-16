import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/UserContext";
import Input from "../components/Input";
import { userDataForm } from "../constants";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { userData } = useAuth();
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
    console.log("Profile updated:", data);
  };

  return (
    <div className="text-center mb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("userForm.title")}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {userDataForm(t).map((element) => (
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
                  value={userData?.[element.name] || element.value}
                  {...register(element.name, {
                    required: element.required,
                    pattern: element.pattern,
                    minLength: element.minLength,
                    maxLength: element.maxLength,
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

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {t("saveChanges")}
          </Button>
        </form>
      </div>
    </div>
  );
};
