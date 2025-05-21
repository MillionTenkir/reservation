"use client";
import { redirect } from "next/navigation";
import CategorySelection from "@/components/category-selection";
import HeroSection from "@/components/hero-section";
import ServiceSection from "@/components/service-section";
import Footer from "@/components/footer";
import PromotionCarousel from "@/components/promotion-carousel";
import HeroCarousel from "@/components/hero-carousel";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

export default function Home() {
  const { token, user, isTokenLoading } = useAuth();

  // Don't redirect if we're still loading the token
  if (isTokenLoading) {
    // console.log("isTokenLoading", isTokenLoading);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E6007E] to-[#E6007E]/70 animate-spin blur-sm"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#E6007E] to-[#E6007E]/70 animate-[spin_1.5s_linear_infinite]"></div>
          <div className="absolute inset-3 rounded-full bg-white"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <>
      <main>
        {/* Desktop hero carousel */}
        <HeroCarousel />

        {/* Mobile hero section */}
        <div className="sm:hidden">
          <HeroSection />
        </div>

        <div className="sm:hidden bg-gray-50 pt-6">
          <PromotionCarousel />
        </div>

        <div
          id="categories"
          className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl"
        >
          {/* <h2 className="text-3xl mb-8 text-center font-semibold text-gray-800">
            Make a Reservation
          </h2> */}
          <Image src="/soreti-logo.png" alt="Soreti Logo" width={100} height={100} />
          <CategorySelection />
        </div>

        <div className="mt-16">
          <ServiceSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
