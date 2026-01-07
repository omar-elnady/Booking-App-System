import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@features/auth/store/authStore";
import { Camera, Trash, User, Shield, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import BasicProfileForm from "@features/dashboards/components/profile/BasicProfileForm";
import SecuritySection from "@features/dashboards/components/profile/SecuritySection";
import DeleteAccountSection from "@features/dashboards/components/profile/DeleteAccountSection";
import { Card } from "@/components/ui/card";

export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(
    user?.userImage?.secure_url || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);

  // Sync preview image with user data when it updates from store
  useEffect(() => {
    if (user?.userImage?.secure_url && !selectedFile) {
      setPreviewImage(user.userImage.secure_url);
    }
  }, [user, selectedFile]);

  // Handle Image
  const handleImageClick = () => fileInputRef.current?.click();
  const handleRemoveImage = () => {
    setPreviewImage("");
    setSelectedFile(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(
          t("pages.userProfile.fileTooLarge") ||
            "File size must be less than 5MB"
        );
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(
          t("pages.userProfile.invalidFileType") ||
            "Please select an image file"
        );
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">
            {t("common.loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-6 space-y-10 animate-in fade-in duration-500">
      {user?.role === "user" ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 dark:border-neutral-800 pb-10 mb-8"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                {isRtl ? "إعدادات الحساب" : "ACCOUNT SETTINGS"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight lowercase first-letter:uppercase">
              {t("pages.userProfile.title")}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-lg font-normal leading-relaxed mt-2">
              {isRtl
                ? "إدارة معلوماتك الشخصية وإعدادات الأمان الخاصة بك."
                : "Manage your personal information and security settings."}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("pages.userProfile.title")}
          </h1>
        </div>
      )}

      <BasicProfileForm
        user={user}
        fileInputRef={fileInputRef}
        previewImage={previewImage}
        selectedFile={selectedFile}
        handleImageClick={handleImageClick}
        handleRemoveImage={handleRemoveImage}
        handleFileChange={handleFileChange}
        Camera={Camera}
        Trash={Trash}
        isRtl={isRtl}
        cn={cn}
      />
      <SecuritySection user={user} isRtl={isRtl} />
      <DeleteAccountSection isRtl={isRtl} />
    </div>
  );
};
