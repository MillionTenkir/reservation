"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Define promotions directly to avoid async loading issues
const promotions = [
  {
    id: "1",
    organizationName: "Healthcare Center",
    image: "/healthcenter.jpg?height=300&width=500",
    discount: "20% OFF",
    description: "Get 20% off on all health checkups this month. Book now!",
    color: "bg-blue-50",
  },
  {
    id: "2",
    organizationName: "Beauty Salon",
    image: "/beautySalon.jpg?height=300&width=500",
    discount: "30% OFF",
    description:
      "Special discount on all beauty treatments. Limited time offer!",
    color: "bg-pink-50",
  },
  {
    id: "3",
    organizationName: "Fitness Club",
    image: "/spa.jpg?height=300&width=500",
    discount: "FREE TRIAL",
    description: "One week free trial for new members. Join today!",
    color: "bg-green-50",
  },
  {
    id: "4",
    organizationName: "Dental Clinic",
    image: "/placeholder.svg?height=300&width=500",
    discount: "15% OFF",
    description: "Special family package with 15% discount on all services.",
    color: "bg-purple-50",
  },
  {
    id: "5",
    organizationName: "Spa & Wellness",
    image: "/spa2.jpg?height=300&width=500",
    discount: "BUY 1 GET 1",
    description: "Book any massage and get one free. Perfect for couples!",
    color: "bg-yellow-50",
  },
];

export default function PromotionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: {
            perView: 2,
            spacing: 16,
          },
        },
      },
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
          }, 5000);
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

  return (
    <div className="relative px-4 pt-4 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div ref={sliderRef} className="keen-slider">
          {promotions.map((promo) => (
            <div key={promo.id} className="keen-slider__slide">
              <Card
                className={`overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow ${promo.color}`}
              >
                <div className="relative h-36 sm:h-40  overflow-hidden">
                  <img
                    src={promo.image || "/placeholder.svg"}
                    alt={promo.organizationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute top-4 right-4 bg-[#E6007E] text-white px-3 py-1 rounded-full font-bold text-sm font-work-sans">
                    {promo.discount}
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-bold text-lg mb-1 font-work-sans">
                      {promo.organizationName}
                    </h3>
                    <p className="text-sm text-white mb-3 font-work-sans">
                      {promo.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="flex justify-center mt-4">
            {promotions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={`mx-1 w-2 h-2 rounded-full ${
                  currentSlide === idx ? "bg-[#E6007E]" : "bg-gray-300"
                }`}
              >
                <span className="sr-only">Go to slide {idx + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
