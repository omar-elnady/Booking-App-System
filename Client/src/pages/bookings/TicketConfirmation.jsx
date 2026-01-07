import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { ticketsService } from "@/services/ticketsService";

const TicketConfirmation = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isVerifying, setIsVerifying] = useState(!!sessionId);

  // Simple window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sessionId) {
      ticketsService
        .verifySession(sessionId)
        .then((data) => {
          console.log("Payment Verified:", data);
        })
        .catch((err) => {
          console.error("Verification failed:", err);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkMainBg">
        <p>Invalid Session</p>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkMainBg flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkMainBg flex items-center justify-center p-4">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={200}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-darkCard rounded-3xl shadow-xl p-8 text-center border border-green-100 dark:border-green-900/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("booking.confirmedTitle") || "You're Going!"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t("booking.confirmedMessage") ||
              "Your ticket has been booked successfully. Check your email for details."}
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/events")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              {t("booking.browseEvents") || "Browse Events"}
            </Button>
            <Button
              onClick={() => navigate("/user/dashboard")}
              variant="outline"
              className="w-full border-gray-200 dark:border-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Home size={18} />
              {t("booking.goToDashboard") || "Go to Dashboard"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketConfirmation;
