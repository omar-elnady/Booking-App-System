import React, { useRef } from "react";
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

  return (
    <div className="   h-fit w-10/12 relative mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <Swiper
        key={i18n.language}
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
        className="swiper_container md:min-h-[55vh] min-h-[85vh]"
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
      <div className="swiper-pagination relative "></div>
    </div>
  );
}

export default SliderEvents;
