import React from "react";
import Button from "../components/Button";
import EventsFullCard from "../components/EventsFullCard";
import { useTranslation } from "react-i18next";

function HomeEventsSection() {
  const { t, i18n } = useTranslation();
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      description:
        "A three-day music festival featuring top artists from around the world. ",
      date: "2025-07-15",
      time: "12:00 PM",
      venue: "Central Park",
      price: 150,
      category: "Music",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Comedy Night Special",
      description:
        "An evening of laughter with top comedians performing their best sets.",
      date: "2025-05-20",
      time: "8:00 PM",
      venue: "Laugh Factory",
      price: 45,
      category: "Entertainment",
      image:
        "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Marathon for Charity",
      description: "Annual marathon raising funds for children's education.",
      date: "2025-10-12",
      time: "7:00 AM",
      venue: "City Center",
      price: 50,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    },
  ];
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
