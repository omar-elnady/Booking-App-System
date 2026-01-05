import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Loader2,
  Lock,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // Step Transition Variants
  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
      filter: "blur(4px)",
      zIndex: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    }),
  };

  // Handlers
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Step 1: Request Code
    import("@/lib/axios").then(({ default: apiClient }) => {
      apiClient
        .patch("/auth/forgetCode", { email })
        .then(() => {
          setStep(2);
          toast.success(
            t("messages.resendVerificationCode") ||
              "Magic code sent to your inbox! ✨"
          );
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Failed to send code");
        })
        .finally(() => setIsLoading(false));
    });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const forgetCode = otp.join("");
    import("@/lib/axios").then(({ default: apiClient }) => {
      apiClient
        .patch("/auth/verifyCode", { email, forgetCode })
        .then(() => {
          toast.success(
            t("messages.codeVerified") || "Code verified successfully!"
          );
          setStep(3);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Invalid or expired code"
          );
        })
        .finally(() => setIsLoading(false));
    });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordInput = e.target.elements[0].value; // newPassword
    // const confirmPasswordInput = e.target.elements[1].value;
    // Validation could go here

    const forgetCode = otp.join("");

    import("@/lib/axios").then(({ default: apiClient }) => {
      apiClient
        .patch("/auth/resetPassword", {
          email,
          forgetCode,
          password: passwordInput,
        })
        .then(() => {
          toast.success(
            t("messages.passwordChangedSuccessfully") ||
              "Your password has been renewed! 🚀"
          );
          navigate("/login");
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Failed to reset password"
          );
        })
        .finally(() => setIsLoading(false));
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-background transition-colors duration-300">
      <motion.div
        className="w-full max-w-lg z-10"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
      >
        <Card className="w-full border-none shadow-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="relative h-1 w-full bg-muted">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>

          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group -ml-2 text-muted-foreground hover:text-foreground"
              >
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t("login.backToLogin") || "Back"}
                </Link>
              </Button>

              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    className={`w-2 h-2 rounded-full ${
                      s <= step ? "bg-primary" : "bg-muted"
                    }`}
                    animate={{ scale: s === step ? 1.5 : 1 }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {step === 1 && <Mail size={32} />}
                    {step === 2 && <ShieldCheck size={32} />}
                    {step === 3 && <RefreshCcw size={32} />}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {step === 1 &&
                      (t("forgotPassword.step1Title") || "Forgot password?")}
                    {step === 2 &&
                      (t("forgotPassword.step2Title") || "Check your email")}
                    {step === 3 &&
                      (t("forgotPassword.step3Title") || "Reset password")}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    {step === 1 &&
                      (t("forgotPassword.step1Desc") ||
                        "Enter your email address to receive a recovery code")}
                    {step === 2 &&
                      (t("forgotPassword.step2Desc") ||
                        `We've sent a 6-digit code to ${email}`)}
                    {step === 3 &&
                      (t("forgotPassword.step3Desc") ||
                        "Create a robust password to secure your account")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-6 min-h-[180px]">
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 && (
                <motion.form
                  key="step1"
                  custom={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handleEmailSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          t("login.emailPlaceholder") || "name@example.com"
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("buttons.sendCode") || "Send Code"
                    )}
                  </Button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  custom={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
                >
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <div key={i} className="w-10 sm:w-12">
                        <Input
                          id={`otp-${i}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-12 text-center text-lg font-bold"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("buttons.verify") || "Verify Code"
                    )}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {t("login.useDifferentEmail") || "Change email address"}
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  custom={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handlePasswordReset}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        required
                        placeholder={
                          t("login.newPasswordPlaceholder") || "New password"
                        }
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        required
                        placeholder={
                          t("login.confirmNewPasswordPlaceholder") ||
                          "Confirm password"
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("buttons.resetPassword") || "Reset Password"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="justify-center py-4 bg-muted/20 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Daghta. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
