import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Building, Users, Bell, Shield } from "lucide-react";

export default function ServiceSection() {
  const services = [
    {
      icon: <Calendar className="h-8 w-8 text-[#E6007E]" />,
      title: "Easy Booking",
      description:
        "Book appointments with your favorite businesses in just a few clicks.",
    },
    {
      icon: <Clock className="h-8 w-8 text-[#E6007E]" />,
      title: "Real-time Availability",
      description:
        "See available time slots in real-time and choose what works for you.",
    },
    {
      icon: <Building className="h-8 w-8 text-[#E6007E]" />,
      title: "Multiple Locations",
      description:
        "Find the most convenient branch location for your appointment.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#E6007E]" />,
      title: "Various Categories",
      description:
        "From healthcare to beauty services, we've got all your needs covered.",
    },
    {
      icon: <Bell className="h-8 w-8 text-[#E6007E]" />,
      title: "Reminders",
      description:
        "Get notifications before your appointment so you never miss it.",
    },
    {
      icon: <Shield className="h-8 w-8 text-[#E6007E]" />,
      title: "Secure & Private",
      description: "Your personal information is always protected and secure.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-normal mb-4 font-gray-800">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-gray-800">
            CHECHE provides a seamless reservation experience across multiple
            service categories. Here's what makes us special.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <CardHeader className="pb-2 flex flex-col items-center">
                <div className="mb-2">{service.icon}</div>
                <CardTitle>
                  <h3 className="text-sm md:text-xl font-gray-700">{service.title}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground font-gray-800 hidden sm:block">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
