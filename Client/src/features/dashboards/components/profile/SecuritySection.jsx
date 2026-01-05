import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Modal from "@/components/common/Modal";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useUpdateEmail,
  useVerifyEmailChange,
  useChangePassword,
  useToggle2FA,
  useRequestOrganizer,
} from "@features/auth/hooks/useProfile";

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
  const [verificationCode, setVerificationCode] = useState("");
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

  const handle2FAToggle = (checked) => {
    setTwoFactorEnabled(checked);
    toggle2FAMutation.mutate(checked, {
      onError: () => setTwoFactorEnabled(!checked),
    });
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

          {/* Organizer Request Section */}
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
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
          )}
        </div>
      </section>

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
