import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, QrCode, Calendar, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: QrCode,
      label: "My Tickets",
      onClick: () => navigate("/user/dashboard"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Calendar,
      label: "Browse Events",
      onClick: () => navigate("/events"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Heart,
      label: "Wishlist",
      onClick: () => navigate("/user/wishlist"),
      color: "bg-pink-500 hover:bg-pink-600",
    },
  ];

  const handleAction = (action) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-20 right-0 flex flex-col gap-3">
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: index * 0.05 },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                    transition: { delay: (actions.length - index - 1) * 0.05 },
                  }}
                  className="flex items-center gap-3"
                >
                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 + 0.1 },
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg"
                  >
                    <span className="text-sm font-medium whitespace-nowrap">
                      {action.label}
                    </span>
                  </motion.div>

                  {/* Button */}
                  <Button
                    size="icon"
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg",
                      action.color
                    )}
                    onClick={() => handleAction(action)}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            isOpen
              ? "bg-destructive hover:bg-destructive/90 rotate-45"
              : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
