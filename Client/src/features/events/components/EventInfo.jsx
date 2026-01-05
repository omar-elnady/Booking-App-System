import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const EventInfo = ({ event }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      {/* Description Card */}
      <Card className="rounded-3xl border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {t("eventDetails.about") || "About This Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            {event.description}
          </p>
        </CardContent>
      </Card>

      {/* Event Details Card */}
      <Card className="rounded-3xl border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {t("eventDetails.eventDetails") || "Event Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-center gap-5 p-6 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
              <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                <Calendar className="w-6 h-6 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {t("eventDetails.date") || "Date"}
                </p>
                <p className="font-bold text-black dark:text-white">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "TBA"}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-5 p-6 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
              <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                <Clock className="w-6 h-6 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {t("eventDetails.time") || "Time"}
                </p>
                <p className="font-bold text-black dark:text-white">
                  {event.time || "TBA"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-5 p-6 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5 sm:col-span-2">
              <div className="p-3 bg-white dark:bg-black rounded-xl shadow-sm border dark:border-white/10">
                <MapPin className="w-6 h-6 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {t("eventDetails.venue") || "Venue"}
                </p>
                <p className="font-bold text-black dark:text-white">
                  {event.venue}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventInfo;
