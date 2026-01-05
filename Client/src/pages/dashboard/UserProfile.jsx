import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@features/auth/store/authStore";
import { Camera, Trash } from "lucide-react";
import apiClient from "@/lib/axios";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import BasicProfileForm from "@features/dashboards/components/profile/BasicProfileForm";
import SecuritySection from "@features/dashboards/components/profile/SecuritySection";
import DeleteAccountSection from "@features/dashboards/components/profile/DeleteAccountSection";

export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { user, updateUser } = useAuthStore();

  // Image Upload State
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(
    user?.userImage?.secure_url || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch Fresh Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/user/me");
        if (res.data.user) {
          updateUser(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [updateUser]);

  // Handle Image
  const handleImageClick = () => fileInputRef.current?.click();
  const handleRemoveImage = () => {
    setPreviewImage("");
    setSelectedFile(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("pages.userProfile.title")}
        </h1>
      </div>

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
