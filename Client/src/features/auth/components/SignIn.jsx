import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import apiClient from "@/lib/axios";
import {
  CreateYourAccount,
  DemoAccounts,
  ForgetYourPassword,
  ContinueAsGuest,
} from "./SignSections.jsx";
import { getLoginForm, loginDefult } from "@/config/constants";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@features/auth/store/authStore";
import { useGoogleLogin } from "@react-oauth/google";

const SignIn = ({ setIsLogin }) => {
  const login = useAuthStore((state) => state.login);
  const [loadingLoginBtn, setLoadingLoginBtn] = useState(false);
  const [loginStep, setLoginStep] = useState("credentials"); // 'credentials' | '2fa'
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === "rtl";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...loginDefult,
      code: "",
    },
  });

  const signIn = async (data) => {
    setLoadingLoginBtn(true);
    try {
      // Build payload based on current step
      const payload =
        loginStep === "2fa"
          ? { email: data.email, password: data.password, code: data.code }
          : { email: data.email, password: data.password };

      const response = await apiClient.post(
        import.meta.env.VITE_USER_LOGIN,
        payload
      );

      // Check for 2FA requirement
      if (response.data.twoFactor) {
        setLoginStep("2fa");
        toast.info(response.data.message || "Enter 2FA Code");
        return;
      }

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

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const response = await apiClient.post("/auth/google", {
        token: tokenResponse.access_token,
      });
      const token = response.data.access_token;
      if (token) {
        const decoded = jwtDecode(token);
        login(decoded, token);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Google Login Failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google Login Failed");
    },
    flow: "implicit",
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <Card className="w-full lg:w-[90%] border-border shadow-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {loginStep === "2fa" ? "Two-Factor Auth" : t("login.signIn")}
          </CardTitle>
          <CardDescription className="text-center">
            {loginStep === "2fa"
              ? "Enter the 6-digit verification code sent to your email."
              : t("login.enterCredentials") ||
                "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(signIn)} className="space-y-4">
            {/* Credentials Step */}
            {loginStep === "credentials" && (
              <div className="space-y-4">
                {getLoginForm(t).map((element) => (
                  <div key={element.name} className="space-y-2">
                    <Label htmlFor={element.name}>{element.label}</Label>
                    <div className="relative">
                      <Input
                        id={element.name}
                        type={
                          element.type === "password"
                            ? showPassword
                              ? "text"
                              : "password"
                            : element.type
                        }
                        placeholder={element.placeholder}
                        {...register(element.name, {
                          required: element.required,
                          pattern: element.pattern,
                          minLength: element.minLength,
                          maxLength: element.maxLength,
                        })}
                        className={
                          element.type === "password"
                            ? isRtl
                              ? "pl-10"
                              : "pr-10"
                            : ""
                        }
                      />
                      {element.type === "password" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${
                            isRtl ? "left-0" : "right-0"
                          }`}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                    </div>
                    {errors[element.name] && (
                      <p className="text-destructive text-xs">
                        {errors[element.name].message ||
                          `${element.label} is invalid`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 2FA Step */}
            {loginStep === "2fa" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    className="text-center text-2xl tracking-[0.5em]"
                    maxLength={6}
                    placeholder="······"
                    {...register("code", {
                      required: "Verification code is required",
                      minLength: {
                        value: 6,
                        message: "Code must be 6 digits",
                      },
                      maxLength: {
                        value: 6,
                        message: "Code must be 6 digits",
                      },
                    })}
                  />
                  {errors.code && (
                    <p className="text-destructive text-xs">
                      {errors.code.message || "Invalid verification code"}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loadingLoginBtn}
              className="w-full"
              size="lg"
            >
              {loadingLoginBtn ? (
                <>
                  <span className="mr-2 animate-spin">⚪</span>
                  {loginStep === "2fa"
                    ? "Verifying..."
                    : t("login.signingIn") + "..."}
                </>
              ) : loginStep === "2fa" ? (
                "Verify Code"
              ) : (
                t("login.signIn")
              )}
            </Button>

            {loginStep === "2fa" && (
              <Button
                variant="link"
                type="button"
                className="w-full"
                onClick={() => setLoginStep("credentials")}
              >
                Back to Login
              </Button>
            )}
          </form>

          {loginStep === "credentials" && (
            <>
              <div className="relative w-full py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => googleLogin()}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign in with Google
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {loginStep === "credentials" && (
            <div className="w-full flex flex-col items-center space-y-2 text-sm">
              <ForgetYourPassword t={t} />
              <CreateYourAccount t={t} setIsLogin={setIsLogin} />

              <ContinueAsGuest t={t} />
              <DemoAccounts t={t} />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
