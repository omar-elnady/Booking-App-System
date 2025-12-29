import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import apiClient from "@/lib/axios";
import {
  CreateYourAccount,
  DemoAccounts,
  ForgetYourPassword,
  ContinueAsGuest,
} from "./SignSections.jsx";
import { getLoginForm, loginDefult } from "@/constants";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@features/auth/store/authStore";
// import { useAuth } from "../context/UserContext.jsx";

const SignIn = ({ setIsLogin }) => {
  // const { loginSumbit, loadingLoginBtn } = useAuth(); // Old usage
  const login = useAuthStore((state) => state.login);
  const [loadingLoginBtn, setLoadingLoginBtn] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...loginDefult,
    },
  });

  const signIn = async (data) => {
    setLoadingLoginBtn(true);
    try {
      const response = await apiClient.post(
        import.meta.env.VITE_USER_LOGIN,
        data
      );
      const token = response.data.access_token;
      if (token) {
        const decoded = jwtDecode(token);
        login(decoded, token);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoadingLoginBtn(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-5 md:px-10 dark:bg-black">
      <div className="lg:w-5/6 w-full bg-white dark:bg-gray-900/70 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5 text-center">
          {t("login.signIn")}
        </h2>
        <form onSubmit={handleSubmit(signIn)} className="space-y-4">
          <div className="space-y-4 pr-2">
            {getLoginForm(t).map((element) => (
              <div key={element.name} className="flex flex-col gap-3">
                <label
                  htmlFor={element.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
            disabled={loadingLoginBtn}
            className="w-full text-white text-lg"
          >
            {loadingLoginBtn ? t("login.signingIn") + "..." : t("login.signIn")}
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
