import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import EventsFullCard from "@features/events/components/EventsFullCard";
import { useTranslation } from "react-i18next";
import TitleSection from "@/components/common/TitleSection";
import { useEvents } from "@/hooks/useEvents";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function SliderEvents() {
  const { t, i18n } = useTranslation();
  const { data } = useEvents({ size: 5, lang: i18n.language });
  const events = data?.events || [];
  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="w-10/12 mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <TitleSection title={t("events.events")} />

      <div className="relative group">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-0">
            {events.map((event) => (
              <CarouselItem key={event._id} className="pl-0">
                <div className="p-1">
                  <EventsFullCard event={event} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {events.length > 1 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-16 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 shadow-xl border-gray-200" />
              <CarouselNext className="hidden md:flex -right-16 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 shadow-xl border-gray-200" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default SliderEvents;
