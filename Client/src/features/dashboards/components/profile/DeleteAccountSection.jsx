import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/Modal";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDeleteAccount } from "@features/auth/hooks/useProfile";

const DeleteAccountSection = ({ isRtl }) => {
  const { t } = useTranslation();
  const deleteAccountMutation = useDeleteAccount();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(null, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  return (
    <div className="border-t border-border pt-8 pb-10">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-destructive">
          {t("pages.userProfile.deleteAccount")}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground max-w-lg">
            {t("pages.userProfile.deleteAccountDescription")}
          </p>
          <Button
            variant="destructive"
            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t("pages.userProfile.deleteAccount")}
          </Button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        dir={isRtl ? "rtl" : "ltr"}
        title={
          <span className="text-destructive">
            {t("pages.userProfile.deleteAccount")}
          </span>
        }
        description={
          t("pages.userProfile.deleteAccountWarning") ||
          "Warning: This action is permanent. All your data, including created events, will be deleted. You cannot delete your account if you have events with active bookings."
        }
        footer={
          <div className="flex gap-2 sm:gap-0 justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteAccountMutation.isPending}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="text-white ml-2"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {t("pages.userProfile.confirmDeleteAccount") ||
                "Confirm Delete Account"}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default DeleteAccountSection;
