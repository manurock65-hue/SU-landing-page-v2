"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";

export interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  image: string;
}

// Adapted from the 21st.dev "Gallery Hover Carousel" pattern: image cards in
// an embla carousel, each revealing a title/summary panel on hover. `url`
// navigation is replaced with `onSelect(id)` so the caller decides what
// "open" means (here: play an embedded video).
export default function GalleryHoverCarousel({
  heading = "Featured Projects",
  items = [],
  onSelect,
}: {
  heading?: string;
  items?: GalleryHoverCarouselItem[];
  onSelect?: (id: string) => void;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    return () => {
      carouselApi.off("select", update);
    };
  }, [carouselApi]);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col justify-between md:mb-10 md:flex-row md:items-end">
        <h3 className="text-lg font-medium leading-relaxed text-slate-950 sm:text-xl lg:text-2xl">{heading}</h3>
        <div className="mt-4 flex gap-2 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-full">
        <Carousel setApi={setCarouselApi} opts={{ dragFree: true }} className="relative w-full max-w-full">
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-[350px]">
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  aria-label={`Play ${item.title}`}
                  className="group relative block h-[300px] w-full text-left md:h-[350px]"
                >
                  <Card className="h-full w-full overflow-hidden rounded-3xl border-slate-200 p-0">
                    <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
                      <Image
                        fill
                        sizes="350px"
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="grid size-14 place-items-center rounded-full bg-white/90 text-[#005be2] shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-6">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 flex h-0 w-full flex-col justify-center overflow-hidden bg-white/95 px-4 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:h-1/2 group-hover:opacity-100">
                      <h3 className="text-base font-semibold text-slate-950 md:text-lg">{item.title}</h3>
                      <p className="line-clamp-2 text-sm text-slate-600">{item.summary}</p>
                      <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full border border-slate-200 text-[#005be2] transition-all duration-500 group-hover:-rotate-45">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Card>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
