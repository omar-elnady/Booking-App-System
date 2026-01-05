import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUpdateProfile } from "@features/auth/hooks/useProfile";

const BasicProfileForm = ({
  user,
  fileInputRef,
  previewImage,
  selectedFile,
  handleImageClick,
  handleRemoveImage,
  handleFileChange,
  Camera,
  Trash,
  isRtl,
  cn,
}) => {
  const { t } = useTranslation();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userName: user?.userName || "",
      phone: user?.phone || "",
    },
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userName: user?.userName || "",
      phone: user?.phone || "",
    },
  });

  const onSubmitProfile = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("userName", data.userName);
    formData.append("phone", data.phone);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">
        {t("pages.userProfile.basicProfile")}
      </h2>

      <div className="flex flex-col gap-10">
        {/* Image Section */}
        <div className="flex flex-col items-center gap-8 py-4">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-muted transition-all hover:scale-105 duration-500 ring-4 ring-primary/5">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-muted-foreground uppercase bg-gradient-to-br from-muted to-muted/50">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
              )}
            </div>
            <Button
              size="icon"
              onClick={handleImageClick}
              className="absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg border-2 border-background hover:scale-110 transition-transform"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImageClick}
              type="button"
              className="rounded-xl h-11 px-6 font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
            >
              <Camera className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
              {t("pages.userProfile.changeImage")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-11 px-6 font-semibold transition-all"
              onClick={handleRemoveImage}
              type="button"
            >
              <Trash className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
              {t("pages.userProfile.removeImage")}
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="h-px bg-border/50 w-full" />

        {/* Inputs Section */}
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("pages.userProfile.firstName")}
              </label>
              <Input
                {...register("firstName", {
                  required: t("pages.userProfile.firstNameRequired"),
                })}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("pages.userProfile.lastName")}
              </label>
              <Input
                {...register("lastName", {
                  required: t("pages.userProfile.lastNameRequired"),
                })}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("pages.userProfile.userName")}
              </label>
              <Input
                {...register("userName", {
                  required: t("pages.userProfile.userNameRequired"),
                  minLength: {
                    value: 2,
                    message:
                      t("pages.userProfile.minLength2") ||
                      "Minimum 2 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9._-]+$/,
                    message:
                      t("pages.userProfile.invalidUserName") ||
                      "Must start with a letter",
                  },
                })}
              />
              {errors.userName && (
                <p className="text-xs text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("pages.userProfile.phoneNumber")}
              </label>
              <Input
                {...register("phone", {
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: t("pages.userProfile.invalidPhone"),
                  },
                })}
                placeholder="01xxxxxxxxx"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                updateProfileMutation.isPending || (!isDirty && !selectedFile)
              }
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("pages.userProfile.saveChanges")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BasicProfileForm;
