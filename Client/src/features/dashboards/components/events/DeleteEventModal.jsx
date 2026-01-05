import React from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, Activity } from "lucide-react";

const DeleteEventModal = ({
  open,
  onOpenChange,
  event,
  onConfirm,
  isPending,
  t,
  i18n,
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="max-w-md"
      title={
        <span className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> {t("manageEvents.confirmDelete")}
        </span>
      }
      description={
        <span className="block pt-2 font-medium text-muted-foreground/80">
          {t("manageEvents.confirmDeleteDesc")}
          <span className="block mt-2 p-3 bg-destructive/5 rounded-xl border border-destructive/10 text-destructive font-semibold text-sm">
            {i18n.language === "ar" ? event?.name?.ar : event?.name?.en}
          </span>
        </span>
      }
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button
            variant="outline"
            className="rounded-xl font-semibold border-border/60"
            onClick={() => onOpenChange(false)}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl font-semibold text-white hover:bg-destructive/80 px-6 shadow-lg shadow-destructive/10"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Activity className="animate-spin h-4 w-4" />
            ) : (
              t("buttons.submit")
            )}
          </Button>
        </div>
      }
    />
  );
};

export default DeleteEventModal;
