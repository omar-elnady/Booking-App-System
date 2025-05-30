import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function RotationLogin({ isLogin }) {
  const { t } = useTranslation();
  const variants = {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  };

  return (
    <div className="relative w-full h-auto">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="welcome-back"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("login.welcomeMessage")}
            </h2>
            <p className="text-gray-200 text-lg">{t("login.signToContinue")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="join-us"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("login.joinUs")}
            </h2>
            <p className="text-gray-200 text-lg">{t("login.createAccount")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RotationLogin;
