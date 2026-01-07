import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Modal from "@/components/common/Modal";
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useUpdateEmail,
  useVerifyEmailChange,
  useChangePassword,
  useToggle2FA,
  useRequestOrganizer,
} from "@features/auth/hooks/useProfile";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

const SecuritySection = ({ user, isRtl }) => {
  const { t } = useTranslation();

  // Identify if user is logged in via Google
  const isGoogleUser = user?.provider === "google";

  // Mutations
  const updateEmailMutation = useUpdateEmail();
  const verifyEmailMutation = useVerifyEmailChange();
  const changePasswordMutation = useChangePassword();
  const toggle2FAMutation = useToggle2FA();
  const requestOrganizerMutation = useRequestOrganizer();

  // Local State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPhoneOTPModalOpen, setIsPhoneOTPModalOpen] = useState(false);
  const [is2FAMethodModalOpen, setIs2FAMethodModalOpen] = useState(false);
  const [selected2FAMethod, setSelected2FAMethod] = useState("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.twoFactorEnabled || false
  );

  // Forms
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm();

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: errorsPass },
    reset: resetPass,
    watch: watchPass,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watchPass("newPassword");

  // Send OTP to new phone number (using our backend instead of Firebase)
  const handleSendPhoneOTP = async () => {
    // Validate phone number
    const phoneRegex = /^(010|011|012|015)\d{8}$/;

    if (!newPhoneNumber) {
      toast.error(
        isRtl ? "من فضلك أدخل رقم الموبايل" : "Please enter your phone number"
      );
      return;
    }

    // Remove spaces and special characters
    const cleanPhone = newPhoneNumber.replace(/[\s\-()]/g, "");

    // Check if contains only numbers
    if (!/^\d+$/.test(cleanPhone)) {
      toast.error(
        isRtl
          ? "رقم الموبايل يجب أن يحتوي على أرقام فقط"
          : "Phone number must contain only digits"
      );
      return;
    }

    // Check if matches Egyptian phone format
    if (!phoneRegex.test(cleanPhone)) {
      toast.error(
        isRtl
          ? "رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقم"
          : "Phone number must start with 010, 011, 012, or 015 and be 11 digits"
      );
      return;
    }

    const formattedPhone = "+20" + cleanPhone.replace(/^0+/, "");

    setPhoneLoading(true);
    try {
      const response = await apiClient.post("/user/send-phone-otp", {
        phone: formattedPhone,
      });

      setIsPhoneModalOpen(false);
      setIsPhoneOTPModalOpen(true);
      toast.success(
        isRtl ? "تم إرسال الكود على موبايلك!" : "OTP sent to your phone!"
      );

      // In development, show OTP in console
      if (response.data.otp) {
        console.log("🔐 OTP Code:", response.data.otp);
        toast.info(
          isRtl
            ? `كود التأكيد: ${response.data.otp}`
            : `Verification Code: ${response.data.otp}`,
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg = error.response?.data?.message;
      toast.error(
        errorMsg ||
          (isRtl
            ? "حصل خطأ في إرسال الكود، حاول تاني"
            : "Error sending OTP, please try again")
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  // Verify OTP and update phone (using our backend)
  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      toast.error("من فضلك أدخل الكود المكون من 6 أرقام");
      return;
    }

    setPhoneLoading(true);
    try {
      let formattedPhone = newPhoneNumber;
      if (!newPhoneNumber.startsWith("+")) {
        formattedPhone = "+20" + newPhoneNumber.replace(/^0+/, "");
      }

      await apiClient.post("/user/verify-phone-otp", {
        phone: formattedPhone,
        otp: phoneOTP,
      });

      toast.success("تم تحديث رقم الموبايل بنجاح!");
      setIsPhoneOTPModalOpen(false);
      setPhoneOTP("");
      setNewPhoneNumber("");
      window.location.reload(); // Refresh to get updated user data
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "الكود غلط، حاول تاني");
    } finally {
      setPhoneLoading(false);
    }
  };

  // Handlers
  const onSubmitEmailChange = (data) => {
    updateEmailMutation.mutate(data, {
      onSuccess: () => {
        setIsEmailModalOpen(false);
        setIsVerifyModalOpen(true);
      },
    });
  };

  const handleVerifyEmail = () => {
    verifyEmailMutation.mutate(verificationCode, {
      onSuccess: () => {
        setIsVerifyModalOpen(false);
      },
    });
  };

  // 2FA Logic
  const toggle2FAService = async (enable, method = null) => {
    try {
      // We need to pass an object { enable, method } to the mutation
      // The useToggle2FA hook likely expects a boolean or object depending on implementation
      // Assuming we need to update the hook usage or pass object
      await toggle2FAMutation.mutateAsync({ enable, method });
      setTwoFactorEnabled(enable);
      setIs2FAMethodModalOpen(false);
      toast.success(
        enable
          ? isRtl
            ? "تم تفعيل المصادقة الثنائية"
            : "2FA Enabled Successfully"
          : isRtl
          ? "تم تعطيل المصادقة الثنائية"
          : "2FA Disabled Successfully"
      );
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error(isRtl ? "حدث خطأ ما" : "Something went wrong");
      setTwoFactorEnabled(!enable);
    }
  };

  const handle2FAToggle = (checked) => {
    if (checked) {
      setIs2FAMethodModalOpen(true);
    } else {
      toggle2FAService(false);
    }
  };

  const handleConfirm2FAMethod = () => {
    if (selected2FAMethod === "phone") {
      if (!user?.phone) {
        setIs2FAMethodModalOpen(false);
        setIsPhoneModalOpen(true);
        toast.info(
          isRtl
            ? "يجب إضافة رقم موبايل أولاً"
            : "Please add a phone number first"
        );
        return;
      }
    }
    toggle2FAService(true, selected2FAMethod);
  };

  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        resetPass();
        setIsPasswordModalOpen(false);
      },
    });
  };

  const handleRequestOrganizer = () => {
    requestOrganizerMutation.mutate();
  };

  return (
    <div className="border-t border-border pt-8 space-y-8">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">
          {t("pages.userProfile.accountSecurity")}
        </h2>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                {t("pages.userProfile.email")}
              </label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            {!isGoogleUser && (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    {t("pages.userProfile.changeEmail")}
                  </Button>
                </div>
                <Modal
                  open={isEmailModalOpen}
                  onOpenChange={setIsEmailModalOpen}
                  dir={isRtl ? "rtl" : "ltr"}
                  title={t("pages.userProfile.changeEmail")}
                  description={t("pages.userProfile.enterNewEmail")}
                >
                  <form
                    onSubmit={handleSubmitEmail(onSubmitEmailChange)}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="new@example.com"
                        {...registerEmail("email", { required: true })}
                      />
                      {errorsEmail?.email && (
                        <span className="text-xs text-destructive">
                          {t("pages.userProfile.required")}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        disabled={updateEmailMutation.isPending}
                      >
                        {updateEmailMutation.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {t("pages.userProfile.sendVerificationCode")}
                      </Button>
                    </div>
                  </form>
                </Modal>
              </>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                {t("pages.userProfile.phoneNumber") || "رقم الموبايل"}
              </label>
              <p className="text-sm text-muted-foreground" dir="ltr">
                {user?.phone || "لم يتم إضافة رقم موبايل"}
              </p>
              {user?.lastPhoneChangeDate &&
                (() => {
                  const hoursSinceChange =
                    (Date.now() -
                      new Date(user.lastPhoneChangeDate).getTime()) /
                    (1000 * 60 * 60);
                  const hoursRemaining = Math.ceil(48 - hoursSinceChange);
                  if (hoursRemaining > 0) {
                    return (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        {isRtl
                          ? `متاح التغيير خلال ${hoursRemaining} ساعة`
                          : `Available in ${hoursRemaining} hours`}
                      </p>
                    );
                  }
                  return null;
                })()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPhoneModalOpen(true)}
              disabled={(() => {
                if (!user?.lastPhoneChangeDate) return false;
                const hoursSinceChange =
                  (Date.now() - new Date(user.lastPhoneChangeDate).getTime()) /
                  (1000 * 60 * 60);
                return hoursSinceChange < 48;
              })()}
            >
              {user?.phone
                ? isRtl
                  ? "تغيير الرقم"
                  : "Change Number"
                : isRtl
                ? "إضافة رقم"
                : "Add Number"}
            </Button>
          </div>

          {/* Phone Change Modal */}
          <Modal
            open={isPhoneModalOpen}
            onOpenChange={setIsPhoneModalOpen}
            dir={isRtl ? "rtl" : "ltr"}
            title="تغيير رقم الموبايل"
            description="سنرسل لك كود تأكيد على الرقم الجديد"
          >
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  أدخل رقمك بدون مفتاح الدولة (01...)
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSendPhoneOTP} disabled={phoneLoading}>
                  {phoneLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  إرسال الكود
                </Button>
              </div>
            </div>
          </Modal>

          {/* Phone OTP Verification Modal */}
          <Modal
            open={isPhoneOTPModalOpen}
            onOpenChange={setIsPhoneOTPModalOpen}
            dir={isRtl ? "rtl" : "ltr"}
            title="تأكيد رقم الموبايل"
            description={`تم إرسال الكود على ${newPhoneNumber}`}
          >
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={phoneOTP}
                  onChange={(e) =>
                    setPhoneOTP(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-bold"
                  dir="ltr"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsPhoneOTPModalOpen(false);
                    setIsPhoneModalOpen(true);
                    setPhoneOTP("");
                  }}
                >
                  تغيير الرقم
                </Button>
                <Button
                  onClick={handleVerifyPhoneOTP}
                  disabled={phoneLoading || phoneOTP.length !== 6}
                >
                  {phoneLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  تأكيد
                </Button>
              </div>
            </div>
          </Modal>
          {user?.role === "user" && (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t("pages.userProfile.organizerRole") || "Organizer Role"}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t("pages.userProfile.organizerRoleDesc") ||
                    "Upgrade your account to create and manage events."}
                </p>
              </div>
              {user?.organizerRequestStatus === "pending" ? (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full border border-yellow-200">
                  {t("status.pending") || "Pending Review"}
                </div>
              ) : user?.organizerRequestStatus === "rejected" ? (
                <div className="flex items-center gap-2">
                  <span className="text-destructive text-sm font-medium mr-2">
                    {t("status.rejected") || "Request Rejected"}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleRequestOrganizer}
                    disabled={requestOrganizerMutation.isPending}
                  >
                    {requestOrganizerMutation.isPending && (
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    )}
                    {t("pages.userProfile.requestAgain") || "Request Again"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleRequestOrganizer}
                  disabled={requestOrganizerMutation.isPending}
                >
                  {requestOrganizerMutation.isPending && (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  )}
                  {t("pages.userProfile.requestAccess") || "Request Access"}
                </Button>
              )}
            </div>
          )}

          {/* Password */}
          {!isGoogleUser && (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t("pages.userProfile.password")}
                </label>
                <p className="text-sm text-muted-foreground">•••••••••••••</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  {t("pages.userProfile.changePassword")}
                </Button>
              </div>
              <Modal
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
                dir={isRtl ? "rtl" : "ltr"}
                title={t("pages.userProfile.changePassword")}
              >
                <form
                  onSubmit={handleSubmitPass(onSubmitPassword)}
                  className="space-y-4 pt-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm">
                      {t("pages.userProfile.currentPassword")}
                    </label>
                    <Input
                      type="password"
                      {...registerPass("oldPassword", {
                        required: t("pages.userProfile.required"),
                      })}
                    />
                    {errorsPass.oldPassword && (
                      <p className="text-xs text-destructive">
                        {errorsPass.oldPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">
                      {t("pages.userProfile.newPassword")}
                    </label>
                    <Input
                      type="password"
                      {...registerPass("newPassword", {
                        required: t("pages.userProfile.required"),
                        minLength: {
                          value: 6,
                          message: t("pages.userProfile.minLength"),
                        },
                      })}
                    />
                    {errorsPass.newPassword && (
                      <p className="text-xs text-destructive">
                        {errorsPass.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">
                      {t("pages.userProfile.confirmPassword")}
                    </label>
                    <Input
                      type="password"
                      {...registerPass("confirmPassword", {
                        required: t("pages.userProfile.required"),
                        validate: (v) =>
                          v === newPassword || t("pages.userProfile.mismatch"),
                      })}
                    />
                    {errorsPass.confirmPassword && (
                      <p className="text-xs text-destructive">
                        {errorsPass.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {t("pages.userProfile.updatePassword")}
                    </Button>
                  </div>
                </form>
              </Modal>
            </div>
          )}

          {/* 2FA */}
          {!isGoogleUser && (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t("pages.userProfile.2StepVerification")}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t("pages.userProfile.additionalSecurity")}
                </p>
                {/* Show current method if enabled */}
                {twoFactorEnabled && user?.twoFactorMethod && (
                  <p className="text-xs text-primary mt-1">
                    {isRtl ? "الطريقة المستخدمة: " : "Method: "}
                    {user.twoFactorMethod === "phone"
                      ? isRtl
                        ? "موبايل"
                        : "Phone"
                      : isRtl
                      ? "إيميل"
                      : "Email"}
                  </p>
                )}
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2FA Method Selection Modal */}
      <Modal
        open={is2FAMethodModalOpen}
        onOpenChange={setIs2FAMethodModalOpen}
        dir={isRtl ? "rtl" : "ltr"}
        title={isRtl ? "اختر طريقة المصادقة" : "Choose Authentication Method"}
        description={
          isRtl
            ? "كيف تريد استلام رمز التحقق؟"
            : "How would you like to receive your verification code?"
        }
      >
        <div className="py-4 space-y-4">
          <div className="flex flex-col gap-3">
            <label
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                selected2FAMethod === "email"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelected2FAMethod("email")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selected2FAMethod === "email"
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selected2FAMethod === "email" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {isRtl ? "البريد الإلكتروني" : "Email Address"}
                </span>
              </div>
            </label>

            <label
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                selected2FAMethod === "phone"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelected2FAMethod("phone")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selected2FAMethod === "phone"
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selected2FAMethod === "phone" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {isRtl ? "رقم الموبايل" : "Phone Number"}
                </span>
              </div>
            </label>

            {selected2FAMethod === "phone" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs rounded-md border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  {isRtl
                    ? "تنبيه: رسائل الموبايل متاحة 3 مرات يومياً كحد أقصى. بعد ذلك سيتم إرسال الكود عبر الإيميل."
                    : "Note: Phone messages are limited to 3 times daily. Subsequent codes will be sent via email."}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleConfirm2FAMethod}>
              {isRtl ? "تأكيد وتفعيل" : "Confirm & Enable"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email Verify Modal */}
      <Modal
        open={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        dir={isRtl ? "rtl" : "ltr"}
        title={t("pages.userProfile.verifyEmailChange")}
        description={t("pages.userProfile.enterCode")}
        footer={
          <div className="flex justify-end w-full">
            <Button
              onClick={handleVerifyEmail}
              disabled={verifyEmailMutation.isPending}
            >
              {verifyEmailMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("pages.userProfile.verify")}
            </Button>
          </div>
        }
      >
        <div className="py-2">
          <Input
            className="text-center text-2xl tracking-[0.5em]"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SecuritySection;
