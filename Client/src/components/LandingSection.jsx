import React, { useState } from "react";
import Button from "./Button";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { MoveDown } from "lucide-react";
// import { useAuth } from '../contexts/AuthContext';
// import EventCard from '../components/EventCard';

const LandingSection = () => {
  const events = [
    {
      id: 1,
      title: "كونسيرت الصيف 2025",
      description: "حفلة موسيقية مليئة بالطاقة مع نجوم البوب العرب!",
      link: "https://example.com/event/summer-concert-2025",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "مهرجان الموسيقى العالمي",
      description: "استمتع بمزيج من الموسيقى العالمية في أجواء مفتوحة.",
      link: "https://example.com/event/world-music-festival",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "ليلة الروك",
      description: "حفلة روك مع أفضل الفرق المحلية والعالمية.",
      link: "https://example.com/event/rock-night",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="h-[85vh] relative py-10   flex items-center justify-center  ">
      <section className="container bg-white  mx-auto overflow-hidden">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop={true}
          dir="rtl"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className=" flex items-center  justify-between rounded  h-[400px]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="flex-5 h-full w-full  rounded-r"
                />
                <div className=" inset-0 flex-3 flex flex-col justify-center items-center  text-black p-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {event.title}
                  </h2>
                  <p className="text-base md:text-lg mb-4">
                    {event.description}
                  </p>
                  <Button
                    href={event.link}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    احجز تذكرتك
                  </Button>
                </div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-gray-200 rounded-full -translate-x-2 translate-y-[-50%]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 rounded-full translate-x-2 translate-y-[-50%]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-gray-200 rounded-full -translate-x-2 translate-y-[50%]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-200 rounded-full translate-x-2 translate-y-[50%]"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <span className="absolute left-1/2 -translate-x-2/3 bottom-5 border border-gray-400 p-2 rounded-full hover:bg-gray-500 cursor-pointer animate-bounce">
        <MoveDown height={20} />
      </span>{" "}
    </div>
  );
};

export default LandingSection;
