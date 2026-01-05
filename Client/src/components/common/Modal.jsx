import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg", // Default width
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("overflow-hidden p-6 rounded-2xl shadow-2xl", maxWidth)}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="py-2">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
