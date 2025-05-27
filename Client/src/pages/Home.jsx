import React from "react";
import Button from "../components/Button";
import EventsFullCard from "../components/EventsFullCard";
import { useTranslation } from "react-i18next";
import { events } from "../lib/Events";

function HomeEventsSection() {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-lightMainBg dark:bg-darkMainBg">
      <div className="container mx-auto py-10   ">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold dark:text-white tracking-tight mb-2">
            {t("home.title")}
          </h1>
          <p className="text-xl text-gray-600">{t("home.subTitle")}</p>
        </div>
        <div className="cards grid grid-cols-1 gap-10">
          {events?.map((event, index) => {
            return <EventsFullCard key={index} event={event} />;
          })}
        </div>
        <div className="flex justify-center pt-15 pb-5">
          <Button> {t("home.goToEvents")}</Button>
        </div>
      </div>
    </div>
  );
}

export default HomeEventsSection;
