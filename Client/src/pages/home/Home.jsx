import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import VideoBG from "@/assets/Video.mp4";
import SliderEvents from "@features/events/components/SliderEvents";
import Features from "@features/home/components/Features";
import { Button } from "@/components/ui/button";
function HomeEventsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate("/events");
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className=" h-screen  mx-auto ">
        <div className="relative h-full  mx-auto ">
          <video
            src={VideoBG}
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="relative z-10 bg-black/80 h-full flex flex-col justify-center px-6 text-center">
            <h1 className="text-6xl font-extrabold text-white tracking-tight mb-2">
              {t("home.title")}
            </h1>
            <p className="text-2xl mt-2 text-gray-200">{t("home.subTitle")}</p>
            <Button
              onClick={handleViewEvents}
              size="lg"
              className="flex gap-2 items-center w-fit mx-auto mt-8 bg-white hover:bg-gray-200 text-black cursor-pointer"
            >
              {t("home.goToEvents")}
            </Button>
          </div>
        </div>
      </div>
      <Features />
      <SliderEvents />
      <div className="flex justify-center pb-20">
        <Button
          onClick={handleViewEvents}
          size="lg"
          className="flex gap-2 items-center mt-10"
        >
          {t("home.goToEvents")}
        </Button>
      </div>
    </div>
  );
}

export default HomeEventsSection;
