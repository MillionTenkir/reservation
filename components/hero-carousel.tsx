"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
  color: string;
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: "1",
      title: "Book Your Appointments With Ease",
      subtitle:
        "Schedule appointments with your favorite businesses in just a few clicks",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "Book Now",
      link: "#categories",
      color: "from-pink-500/20 to-purple-500/20",
    },
    {
      id: "2",
      title: "Healthcare Made Simple",
      subtitle:
        "Find and book medical appointments with top healthcare providers",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "Explore Healthcare",
      link: "#categories",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "3",
      title: "Beauty & Wellness",
      subtitle: "Treat yourself to a day of relaxation and self-care",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "Find Services",
      link: "#categories",
      color: "from-rose-500/20 to-orange-500/20",
    },
  ]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: true,
    },
    [
      // Add auto-play plugin
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 6000);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        // Cleanup function
        return () => {
          clearTimeout(timeout);
        };
      },
    ]
  );

  // Ensure we have slides before rendering
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative hidden sm:block">
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide) => (
          <div key={slide.id} className="keen-slider__slide">
            <div
              className={`relative h-[500px] w-full overflow-hidden bg-gradient-to-r ${slide.color}`}
            >
              <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              </div>

              <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 font-work-sans">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 font-work-sans">
                    {slide.subtitle}
                  </p>
                  <Button
                    className="bg-[#E6007E] hover:bg-[#C4006C] text-white px-8 py-6 h-auto text-lg rounded-full font-work-sans"
                    asChild
                  >
                    <Link href={slide.link}>
                      {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx);
              }}
              className={`mx-1 w-3 h-3 rounded-full transition-all ${
                currentSlide === idx ? "bg-[#E6007E] w-6" : "bg-white/50"
              }`}
            >
              <span className="sr-only">Go to slide {idx + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
