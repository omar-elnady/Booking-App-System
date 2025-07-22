import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

function Dialog({ btnLabel, title, desc, onSubmit, children , useDefultButtons }) {
  const [open, setOpen] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className=" text-right">
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-600  text-white hover:bg-blue-700"
        >
          {btnLabel}
        </Button>
      </div>

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
              <div className="my-3">{children}</div>
              {useDefultButtons && (
                <div className="mt-3 py-2 text-right gap-2 flex justify-end">
                  <Button
                    onClick={() => setOpen(false)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onSubmit}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Create
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dialog;
