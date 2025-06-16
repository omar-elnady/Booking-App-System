import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import VideoBG from "./../assets/Video.mp4";
import SliderEvents from "../components/SliderEvents";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
function HomeEventsSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate("/events");
  };
  const isArabic = i18n.language === "ar";
  const arrowAnimation = {
    hover: {
      x: isArabic ? [-8, 0, -8] : [0, 8, 0],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
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
      <div className="flex justify-center  pb-20">
        <motion.button
          className="flex gap-2 items-center bg-mainColor hover:bg-indigo-700 text-white cursor-pointer transition duration-300 ease-in  font-semibold py-1.5 px-4 rounded"
          onClick={handleViewEvents}
          whileHover="hover"
        >
          {t("home.goToEvents")}
          <motion.div variants={arrowAnimation}>
            {isArabic ? <ArrowLeft /> : <ArrowRight />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}

export default HomeEventsSection;
