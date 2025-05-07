import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden hidden sm:block">
      {/* Hidden on mobile with "hidden sm:block" */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[#E6007E] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-work-sans">
          Reservations <span className="text-[#E6007E]">Made Simple</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-work-sans">
          Book appointments with your favorite businesses in just a few clicks. No more waiting in line or making phone
          calls.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center">
            <div className="bg-[#E6007E]/10 p-2 rounded-full mr-2">
              <Calendar className="h-5 w-5 text-[#E6007E]" />
            </div>
            <span>Easy Scheduling</span>
          </div>
          <div className="flex items-center">
            <div className="bg-[#E6007E]/10 p-2 rounded-full mr-2">
              <Clock className="h-5 w-5 text-[#E6007E]" />
            </div>
            <span>Real-time Availability</span>
          </div>
          <div className="flex items-center">
            <div className="bg-[#E6007E]/10 p-2 rounded-full mr-2">
              <MapPin className="h-5 w-5 text-[#E6007E]" />
            </div>
            <span>Multiple Locations</span>
          </div>
        </div>

        <Button className="bg-[#E6007E] hover:bg-[#C4006C] text-white px-8 py-6 h-auto text-lg rounded-full font-work-sans" asChild>
          <Link href="#categories">
            Make a Reservation <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
