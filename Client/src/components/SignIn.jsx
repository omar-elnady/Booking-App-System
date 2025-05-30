import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";

import {
  CreateYourAccount,
  DemoAccounts,
  ForgetYourPassword,
  ContinueAsGuest,
} from "./SignSections.jsx";
import { getLoginForm, loginDefult } from "../constants.js";
import { useTranslation } from "react-i18next";

const SignIn = ({ setIsLogin }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...loginDefult,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Login data:", data);
      // Add your API call here
      // Example: await loginUser(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-5 md:px-10 dark:bg-darkCard">
      <div className="lg:w-5/6  w-full">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-textDark mb-5 text-center">
          {t("login.signIn")}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[450px] overflow-y-auto space-y-4 pr-2">
            {getLoginForm(t).map((element) => (
              <div key={element.name}>
                <label
                  htmlFor={element.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
          </div>

          <Button type="submit" disabled={isLoading} className="w-full text-lg">
            {isLoading ? t("login.signingIn") + "..." : t("login.signIn")}
          </Button>
        </form>

        <div className="mt-6 text-center flex flex-col space-y-2">
          <ForgetYourPassword t={t} />
          <CreateYourAccount t={t} setIsLogin={setIsLogin} />
          <ContinueAsGuest t={t} />
          <DemoAccounts t={t} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
