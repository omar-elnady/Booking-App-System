import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Key, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2,
  Lock,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

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
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)"
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            zIndex: 1,
            transition: {
                duration: 0.4,
                ease: "circOut"
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
            zIndex: 0,
            transition: {
                duration: 0.3,
                ease: "circIn"
            }
        })
    };

    // Handlers
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            toast.success("Magic code sent to your inbox! ✨");
        }, 1500);
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
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
            toast.success("Identity verified! 🔐");
        }, 1500);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Your password has been renewed! 🚀");
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gray-50 dark:bg-black transition-colors duration-300">
            {/* Main Card */}
            <motion.div 
                layout
                className="w-full max-w-2xl relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
                    
                    {/* Progress Header */}
                    <div className="relative h-1.5 bg-gray-100 dark:bg-black">
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-500"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Navigation Back */}
                        <div className="flex justify-between items-center mb-8">
                            <Link 
                                to="/login" 
                                className="group flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                </div>
                                {t("login.backToLogin") || "Back"}
                            </Link>

                            {/* Step Indicator (Visual) */}
                            <div className="flex gap-2">
                                {[1, 2, 3].map((s) => (
                                    <motion.div 
                                        key={s}
                                        className={`w-2 h-2 rounded-full ${s <= step ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        animate={{ scale: s === step ? 1.5 : 1 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Title Section */}
                        <div className="text-center mb-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-gray-800 mb-6 text-indigo-600 dark:text-indigo-400">
                                        {step === 1 && <Mail size={40} />}
                                        {step === 2 && <ShieldCheck size={40} />}
                                        {step === 3 && <RefreshCcw size={40} />}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                        {step === 1 && (t("forgotPassword.step1Title") || "Forgot password?")}
                                        {step === 2 && (t("forgotPassword.step2Title") || "Check your email")}
                                        {step === 3 && (t("forgotPassword.step3Title") || "Reset password")}
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto">
                                        {step === 1 && (t("forgotPassword.step1Desc") || "Enter your email address and we'll send you a code to reset your password.")}
                                        {step === 2 && (t("forgotPassword.step2Desc") || `We've sent a 6-digit verification code to ${email}`)}
                                        {step === 3 && (t("forgotPassword.step3Desc") || "Create a strong password to secure your account.")}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Forms Container */}
                        <div className="relative min-h-[160px]">
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
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder={t("login.emailPlaceholder") || "Enter your email"}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg font-semibold bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-gray-200 rounded-xl transition-all transform hover:-translate-y-0.5">
                                            {isLoading ? <Loader2 className="animate-spin" /> : (t("buttons.sendCode") || "Send Code")}
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
                                        className="space-y-8"
                                    >
                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg font-semibold bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-gray-200 rounded-xl transition-all transform hover:-translate-y-0.5">
                                            {isLoading ? <Loader2 className="animate-spin" /> : (t("buttons.verify") || "Verify Code")}
                                        </Button>
                                        <div className="text-center">
                                            <button type="button" onClick={() => setStep(1)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                                                {t("login.useDifferentEmail") || "Use a different email address"}
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
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder={t("login.newPasswordPlaceholder") || "New password"}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder={t("login.confirmNewPasswordPlaceholder") || "Confirm password"}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg font-semibold bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-green-600 dark:hover:bg-green-400 hover:text-white rounded-xl transition-all transform hover:-translate-y-0.5">
                                            {isLoading ? <Loader2 className="animate-spin" /> : (t("buttons.resetPassword") || "Reset Password")}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center">
                   <p className="text-gray-500 dark:text-gray-500 text-sm">© {new Date().getFullYear()} Daghta. All rights reserved.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
