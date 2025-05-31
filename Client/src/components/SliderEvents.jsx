import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import EventsFullCard from "../components/Events/EventsFullCard";
import { events } from "../lib/Events";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";

function SliderEvents() {
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
      swiperRef.current.swiper.slideToLoop(0);
    }
  }, [i18n.language]);
  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <Swiper
        ref={swiperRef}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        coverflowEffect={{
          rotate: 30,
          stretch: 20,
          depth: 200,
          modifier: 1.5,
          slideShadows: false,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="swiper_container"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
            effect: "slide",
            coverflowEffect: { rotate: 0, stretch: 0, depth: 0 },
          },
          1024: { slidesPerView: 1, spaceBetween: 30 },
        }}
      >
        {events?.map((event, index) => (
          <SwiperSlide key={index}>
            <EventsFullCard event={event} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SliderEvents;
