import React from "react";
import { XCircle, Home, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const TicketCancelled = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkMainBg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-darkCard rounded-3xl shadow-xl p-8 text-center border border-red-100 dark:border-red-900/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("booking.cancelledTitle") || "Payment Cancelled"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("booking.cancelledMessage") ||
            "The payment process was cancelled using the checkout session. No charges were made."}
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/events")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            {t("booking.tryAgain") || "Try Booking Again"}
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full border-gray-200 dark:border-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Home size={18} />
            {t("booking.backHome") || "Back to Home"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketCancelled;
