import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserMinus, Mail, Sparkles } from "lucide-react";
import { useFollowing, useToggleFollow } from "@/hooks/useTickets";
import { motion, AnimatePresence } from "framer-motion";

export default function Following() {
  const { t } = useTranslation();
  const { data: followingData, isLoading } = useFollowing();
  const toggleFollow = useToggleFollow();

  const following = followingData?.following || [];

  const handleUnfollow = (organizerId) => {
    toggleFollow.mutate(organizerId);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-1 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 dark:border-neutral-800 pb-10"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                {t("following.tag") || "Network"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight lowercase first-letter:uppercase">
              {t("following.title") || "Following"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-md font-normal leading-relaxed mt-2">
              {t("following.subtitle") ||
                "Stay connected with your favorite event organizers and never miss an update."}
            </p>
          </div>

          <div className="relative group">
            <div className="relative flex items-center gap-4 bg-white dark:bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {t("following.total") || "Following"}
                </span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">
                  {following.length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Following Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-neutral-400 font-medium text-xs uppercase tracking-[0.2em] animate-pulse">
              {t("common.loading") || "Loading..."}
            </p>
          </div>
        ) : following.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center max-w-md w-full p-12 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-300">
                <Users className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {t("following.empty") || "Not Following Anyone"}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
                  {t("following.emptyDesc") ||
                    "Discover and follow talented organizers to stay updated on their latest events."}
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/events")}
                className="mt-4 h-12 px-8 rounded-2xl font-bold bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 hover:opacity-90 transition-all active:scale-95"
              >
                {t("buttons.browseEvents") || "Explore Events"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {following.map((organizer, index) => (
                <motion.div
                  key={organizer._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  layout
                  className="h-full"
                >
                  <Card className="group h-full flex flex-col relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 transition-all duration-500 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/20">
                    <CardContent className="p-8 flex flex-col gap-6 h-full text-center">
                      {/* Avatar Section */}
                      <div className="relative mx-auto">
                        <Avatar className="h-28 w-28 border-4 border-white dark:border-neutral-800 shadow-xl transition-transform duration-500 group-hover:scale-105">
                          <AvatarImage
                            src={organizer.userImage?.secure_url}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-3xl font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                            {organizer.userName?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Info Section */}
                      <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-xl text-neutral-900 dark:text-white line-clamp-1 leading-tight">
                          {organizer.firstName && organizer.lastName
                            ? `${organizer.firstName} ${organizer.lastName}`
                            : organizer.userName}
                        </h3>
                        <p className="text-sm font-semibold text-primary tracking-wide">
                          @{organizer.userName}
                        </p>

                        {organizer.email && (
                          <div className="flex items-center justify-center gap-2 pt-3 text-xs font-medium text-neutral-400">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="line-clamp-1 truncate max-w-[180px]">
                              {organizer.email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/50">
                        <Button
                          variant="ghost"
                          className="w-full h-12 rounded-2xl font-bold text-sm text-neutral-500 hover:text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 transition-all group/btn active:scale-95"
                          onClick={() => handleUnfollow(organizer._id)}
                          disabled={toggleFollow.isLoading}
                        >
                          <UserMinus className="mr-2 h-4 w-4 transition-transform group-hover/btn:-translate-x-0.5" />
                          {t("buttons.unfollow") || "Unfollow"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
