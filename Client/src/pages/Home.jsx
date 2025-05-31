import React from "react";
import Button from "../components/Button";
import EventsFullCard from "../components/Events/EventsFullCard";
import { useTranslation } from "react-i18next";
import { events } from "../lib/Events";
import { useNavigate } from "react-router-dom";
import VideoBG from "./../assets/Video.mp4";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import SliderEvents from "../components/SliderEvents";

function HomeEventsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate("/events");
  };

  return (
    <div className="bg-lightMainBg dark:bg-darkMainBg">
      <div className=" bg-red-500 h-screen  mx-auto ">
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
            <p className="text-2xl text-gray-200">{t("home.subTitle")}</p>
          </div>
        </div>
      </div>

      <SliderEvents />
      <div className="flex justify-center pt-2 pb-5">
        <Button onClick={handleViewEvents}> {t("home.goToEvents")}</Button>
      </div>
    </div>
  );
}

export default HomeEventsSection;
