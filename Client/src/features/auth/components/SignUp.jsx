import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { getRegisterForm, registerDefult } from "@/config/constants";
import { YouAlreadyHaveAccount } from "./SignSections";
import { useTranslation } from "react-i18next";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Eye, EyeOff, Building2, ChevronDown, ChevronUp } from "lucide-react";

const SignUp = ({ setIsLogin }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [isLoading, setIsLoading] = useState(false);
  const [requestOrganizer, setRequestOrganizer] = useState(false);
  const [organizerSummary, setOrganizerSummary] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...registerDefult,
    },
  });

  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Include requestOrganizer flag in the payload
      const payload = { ...data, requestOrganizer, organizerSummary };
      const response = await apiClient.post(`/auth/register`, payload);

      if (response.status === 201) {
        // If user requested organizer role, submit request
        if (requestOrganizer) {
          try {
            // Need to login first or have a way to associate?
            // Better to handle this: Registration returns token?
            // If yes, we can use it. But usually registration sends email confirm.
            // Assuming we can't make authenticated requests yet, we might need
            // to send this flag WITH the registration data if the backend supports it.
            // OR the backend needs to handle "pending organizer" status on creation.
            // Since we modified User model to have 'organizerRequestStatus',
            // let's pass this flag to the register endpoint.
            // But wait, the register endpoint might not accept it directly.
            // Plan B: Update register endpoint to accept 'requestOrganizer' flag.
            // Let's assume we modify the backend next.
            // For now, I'll send it in the body.
            // Note: need to re-call API with this new data structure?
            // No, 'response' is already done above.
            // Let's refactor to send it in the initial call.
          } catch (err) {
            console.error(err);
          }
        }

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
    <div className="w-full flex justify-center px-4 md:px-0">
      <Card className="w-full lg:w-[90%] border-border shadow-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {t("login.signup")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("login.createAccountDesc") || "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getRegisterForm(t).map((element) => (
                <div
                  key={element.name}
                  className={`space-y-2 ${
                    element.name === "firstName" || element.name === "lastName"
                      ? "col-span-1"
                      : "col-span-1 md:col-span-2"
                  }`}
                >
                  <Label htmlFor={element.name}>{element.label}</Label>
                  <div className="relative">
                    <Input
                      id={element.name}
                      type={
                        element.type === "password"
                          ? showPassword[element.name]
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
                        onClick={() => togglePassword(element.name)}
                      >
                        {showPassword[element.name] ? (
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
            {/* Organizer Request Toggle */}
            <div className="pt-2">
              <Button
                type="button"
                variant={requestOrganizer ? "secondary" : "outline"}
                className="w-full flex justify-between items-center group"
                onClick={() => setRequestOrganizer(!requestOrganizer)}
              >
                <div className="flex items-center gap-2">
                  <Building2
                    className={`h-4 w-4 ${
                      requestOrganizer
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                  <span>
                    {t("login.requestOrganizer") ||
                      "I want to become an Organizer"}
                  </span>
                </div>
                {requestOrganizer ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            {requestOrganizer && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="organizerSummary">
                  {t("login.organizerSummary") ||
                    "Tell us about yourself or your organization"}
                </Label>
                <textarea
                  id="organizerSummary"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={
                    t("login.organizerSummaryPlaceholder") ||
                    "I have experience organizing localized events..."
                  }
                  value={organizerSummary}
                  onChange={(e) => setOrganizerSummary(e.target.value)}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 animate-spin">⚪</span>
                  {t("login.signingUp")}...
                </>
              ) : (
                t("login.signup")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <YouAlreadyHaveAccount setIsLogin={setIsLogin} t={t} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
