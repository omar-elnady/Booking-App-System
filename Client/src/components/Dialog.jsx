import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useTranslation } from "react-i18next";
function Dialog({
  title,
  desc,
  onSubmit,
  children,
  closeDialog,
  submitDialog,
  isForm,
  reset,
  open,
  setOpen,
}) {
  
  const { t } = useTranslation();
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setOpen(false);
      if (isForm && reset) reset();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-black/40 w-screen h-screen absolute top-0 left-0 overlay flex items-center justify-center"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="p-5 bg-white rounded-md max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">{title}</h2>
              <p className="text-gray-500">{desc}</p>
            </div>
            {isForm ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="my-3">{children}</div>
                <div className="mt-3 py-2 text-right gap-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (reset) reset();
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {closeDialog || t("buttons.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {submitDialog || t("buttons.submit")}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="my-3">{children}</div>
                <div className="mt-3 py-2 text-right gap-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {closeDialog || t("buttons.cancel")}
                  </Button>
                  <Button
                    onClick={onSubmit}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {submitDialog || t("buttons.confirm")}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Dialog;
