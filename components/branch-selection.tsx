"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  Clock,
  CalendarIcon,
  CheckCircle,
  ArrowLeft,
  Users,
  LocateFixed,
  UserRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/auth-context";

const formatMyDate = (date: Date | undefined) => {
  if (!date) return { name: "", date: "" };
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  const formattedDate = `${month}-${day}-${year}`;
  return {
    name: formattedDate,
    date: formattedDate,
  };
};

const fetchBranchByCompany = async (companyId: any) => {
  if (!companyId) return [];
  try {
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/branches/by-organization?organization_id=${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    // console.log("the error is: ", error);
    return error;
  }
};

const fetchAvailableServices = async (branch: any) => {
  const token = localStorage.getItem("auth-token");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/branch_services/findServicesByBranchGuest?branch_id=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.services;
};

const fetchTimeSlotsByDate = async (
  branchId: any,
  date: any,
  serviceId: any
) => {
  const token = localStorage.getItem("auth-token");
  const formattedDate = formatMyDate(date);
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/appointments/availableTimeSlotsByDateWithPercentage?branch_id=${branchId}&branch_service_id=${serviceId}&appointment_date=${formattedDate.date}&slot=paid`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // console.log("the response is: ", response.data.data);
  return response.data.data;
};

const fetchBranchOfficers = async () => {
  try {
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/users/branch-officers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching branch officers:", error);
    return [];
  }
};

interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  location: {
    address: string;
  };
  branch_services_per_hour: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

interface TimeSlot {
  duration_id: string;
  time_from: string;
  time_to: string;
  is_morning: boolean;
  current_appointments: string;
  remaining_slots: number;
}

interface Officer {
  id: string;
  firstname: string;
  lastname: string;
}

type Step = "category" | "organization" | "branch" | "service" | "datetime";

interface BranchSelectionProps {
  organization: Organization;
  onBack: () => void;
  // handleBackforCategory: () => void;
  currentStep?: Step;
  onStepChange?: (step: Step) => void;
  setCurrentStep?: (step: Step) => void;
}

// Helper function to group time slots by period
const groupTimeSlotsByPeriod = (slots: TimeSlot[]) => {
  return slots.reduce(
    (acc, slot) => {
      if (slot.is_morning) {
        acc.morning.push(slot);
      } else {
        acc.afternoon.push(slot);
      }
      return acc;
    },
    { morning: [] as TimeSlot[], afternoon: [] as TimeSlot[] }
  );
};

// Sort the morning and afternoon slots by time_from
const sortedGroupTimeSlotsByPeriod = (slots: TimeSlot[]) => {
  const grouped = groupTimeSlotsByPeriod(slots);

  // Sort morning and afternoon slots by time_from
  grouped.morning.sort((a, b) => a.time_from.localeCompare(b.time_from));
  grouped.afternoon.sort((a, b) => a.time_from.localeCompare(b.time_from));

  return grouped;
};

export default function BranchSelection({
  organization,
  onBack,
  // handleBackforCategory,
  currentStep = "branch",
  onStepChange,
  setCurrentStep,
}: BranchSelectionProps) {
  const [localStep, setLocalStep] = useState<Step>(currentStep);
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  // const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const branchCarouselRef = useRef<HTMLDivElement>(null);
  const serviceCarouselRef = useRef<HTMLDivElement>(null);
  const [autoScrollBranch, setAutoScrollBranch] = useState(true);
  const [autoScrollService, setAutoScrollService] = useState(true);

  const {
    data: branches,
    isLoading: branchesLoading,
    error: branchesError,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranchByCompany("df41b5cf-0a23-4fa0-b9d1-f0f58791ffc1"),
    enabled: !!organization.id,
  });

  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services", selectedBranch?.id],
    queryFn: () => fetchAvailableServices(selectedBranch?.id),
    enabled: !!selectedBranch,
  });

  const {
    data: timeSlots,
    isLoading: timeSlotsLoading,
    error: timeSlotsError,
  } = useQuery({
    queryKey: [
      "timeSlots",
      selectedBranch?.id,
      selectedDate,
      selectedService?.id,
    ],
    queryFn: () =>
      fetchTimeSlotsByDate(
        selectedBranch?.id,
        selectedDate,
        selectedService?.id
      ),
    enabled: !!selectedBranch && !!selectedDate && !!selectedService,
  });

  // const {
  //   data: officers,
  //   isLoading: officersLoading,
  //   error: officersError,
  // } = useQuery({
  //   queryKey: ["officers"],
  //   queryFn: fetchBranchOfficers,
  // });

  // Add event listener to reset selections when a new category is selected
  useEffect(() => {
    const handleResetSelections = () => {
      setSelectedBranch(null);
      setSelectedService(null);
      setSelectedDate(undefined);
      setSelectedTime(null);
      setLocalStep("branch");
    };

    window.addEventListener("resetSelections", handleResetSelections);

    return () => {
      window.removeEventListener("resetSelections", handleResetSelections);
    };
  }, []);

  // Auto-scroll branches effect
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;

    if (
      autoScrollBranch &&
      !selectedBranch &&
      branchCarouselRef.current &&
      branches?.length > 0
    ) {
      scrollInterval = setInterval(() => {
        if (branchCarouselRef.current) {
          const scrollAmount = 120; // Approximate width of a branch item
          const currentScroll = branchCarouselRef.current.scrollLeft;
          const maxScroll =
            branchCarouselRef.current.scrollWidth -
            branchCarouselRef.current.clientWidth;

          // If we're at the end, loop back to start
          if (currentScroll >= maxScroll - 20) {
            branchCarouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            branchCarouselRef.current.scrollBy({
              left: scrollAmount,
              behavior: "smooth",
            });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [selectedBranch, branches, autoScrollBranch]);

  // Auto-scroll services effect
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;

    if (
      autoScrollService &&
      !selectedService &&
      serviceCarouselRef.current &&
      services?.length > 0
    ) {
      scrollInterval = setInterval(() => {
        if (serviceCarouselRef.current) {
          const scrollAmount = 120; // Approximate width of a service item
          const currentScroll = serviceCarouselRef.current.scrollLeft;
          const maxScroll =
            serviceCarouselRef.current.scrollWidth -
            serviceCarouselRef.current.clientWidth;

          // If we're at the end, loop back to start
          if (currentScroll >= maxScroll - 20) {
            serviceCarouselRef.current.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          } else {
            serviceCarouselRef.current.scrollBy({
              left: scrollAmount,
              behavior: "smooth",
            });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [selectedService, services, autoScrollService]);

  // Auto-scroll to today when component mounts or when step changes to datetime
  useEffect(() => {
    if (localStep === "datetime" && dateScrollRef.current) {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        dateScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      }, 100);
    }
  }, [localStep]);

  // Update localStep when currentStep prop changes
  useEffect(() => {
    if (currentStep) {
      setLocalStep(currentStep);
    }
  }, [currentStep]);

  if (branchesError || timeSlotsError) {
    toast({
      title: "Error",
      description: "Failed to load data. Please try again.",
      variant: "destructive",
    });
  }

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setLocalStep("service");
    setAutoScrollBranch(false);

    // Notify parent component about step change
    if (onStepChange) {
      onStepChange("service");
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setAutoScrollService(false);
  };

  // const handleOfficerSelect = (officerId: string) => {
  //   const officer = officers?.find((o: Officer) => o.id === officerId);
  //   setSelectedOfficer(officer || null);
  //   setLocalStep("datetime");

  //   // Notify parent component about step change
  //   if (onStepChange) {
  //     onStepChange("datetime");
  //   }
  // };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    setShowConfirmation(true);
  };

  const handleBack = () => {
    if (localStep === "service") {
      setSelectedService(null);
      setLocalStep("branch");

      // Notify parent component about step change
      if (onStepChange) {
        onStepChange("branch");
      }
    } else if (localStep === "datetime") {
      setSelectedDate(undefined);
      setSelectedTime(null);
      // setSelectedOfficer(null);
      setLocalStep("service");

      // Notify parent component about step change
      if (onStepChange) {
        onStepChange("service");
      }
    } else {
      // Go back to organization selection
      onBack();
    }
  };

  const handleConfirmReservation = async () => {
    setIsProcessing(true);

    const reservationData = {
      first_name: user?.data?.firstname,
      last_name: user?.data?.lastname,
      mobile: user?.data?.mobile,
      status: "confirmed",
      created_by: user?.data?.id,
      appointment_through: "self",
      branch_service_id: selectedService?.id,
      appointment_date: formatMyDate(selectedDate).date,
      appointment_duration_id: selectedTime?.duration_id,
      party_size: 1,
      // officer_id: selectedOfficer?.id,
    };

    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/appointments/add_reservation`,
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("the response is: ", response);
      if (response.status === 200 || response.status === 201) {
        setShowConfirmation(false);
        setShowSuccess(true);
        setTimeout(() => {
          // router.push("/");
          setShowSuccess(false);
          setSelectedTime(null);
          setSelectedDate(undefined);
          setSelectedService(null);
          setSelectedBranch(null);
          setCurrentStep?.("branch");
          // onBack();
          // handleBackforCategory();
        }, 3000);
      } else {
        setShowConfirmation(false);
        toast({
          title: "Error",
          description: "Failed to create reservation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("the error is: ", error);
      toast({
        title: "Error",
        description: "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Group time slots by morning/afternoon
  const groupedTimeSlots = timeSlots
    ? sortedGroupTimeSlotsByPeriod(timeSlots)
    : { morning: [], afternoon: [] };

  // Format time for display (24h to 12h)
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const hourNum = Number.parseInt(hour);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute || "00"} ${period}`;
  };

  // Render Branch Selection Step
  const renderBranchSelection = () => {
    if (branchesLoading) {
      return (
        <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start"
            >
              <div className="rounded-full bg-gray-200 w-16 h-16 mb-2">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={branchCarouselRef}
        className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar"
        onMouseEnter={() => setAutoScrollBranch(false)}
        onMouseLeave={() => !selectedBranch && setAutoScrollBranch(true)}
      >
        {branches?.length > 0 &&
          branches?.map((branch: Branch) => (
            <motion.div
              key={branch.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start cursor-pointer"
              onClick={() => handleBranchSelect(branch)}
            >
              <div
                className={`flex items-center justify-center rounded-full w-16 h-16 mb-2 ${
                  selectedBranch?.id === branch.id
                    ? "bg-[#E6007E]/10 border-2 border-[#E6007E]"
                    : "bg-[#E6007E]/5 border border-[#E6007E]/30"
                }`}
              >
                <MapPin
                  className={`h-6 w-6 ${
                    selectedBranch?.id === branch.id
                      ? "text-[#E6007E]"
                      : "text-[#E6007E]/70"
                  }`}
                />
              </div>
              <span
                className={`text-center font-medium text-sm ${
                  selectedBranch?.id === branch.id
                    ? "text-[#E6007E]"
                    : "text-gray-700"
                }`}
              >
                {branch.name}
              </span>
              <span className="text-xs text-gray-500 text-center line-clamp-1">
                {branch.location?.address}
              </span>
            </motion.div>
          ))}
      </div>
    );
  };

  // Render Service Selection Step
  const renderServiceSelection = () => {
    if (servicesLoading) {
      return (
        <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start"
            >
              <div className="rounded-full bg-gray-200 w-16 h-16 mb-2">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        // ref={serviceCarouselRef}
        className="grid grid-cols-3 overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar"
        onMouseEnter={() => setAutoScrollService(false)}
        onMouseLeave={() => !selectedService && setAutoScrollService(true)}
      >
        {services?.length > 0 &&
          services?.map((service: Service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start cursor-pointer"
              onClick={() => handleServiceSelect(service)}
            >
              <div
                className={`flex items-center justify-center rounded-full w-16 h-16 mb-2 ${
                  selectedService?.id === service.id
                    ? "bg-[#E6007E]/10 border-2 border-[#E6007E]"
                    : "bg-[#E6007E]/5 border border-[#E6007E]/30"
                }`}
              >
                <LocateFixed
                  className={`h-6 w-6 ${
                    selectedService?.id === service.id
                      ? "text-[#E6007E]"
                      : "text-[#E6007E]/70"
                  }`}
                />
              </div>
              <span
                className={`text-center font-medium text-sm ${
                  selectedService?.id === service.id
                    ? "text-[#E6007E]"
                    : "text-gray-700"
                }`}
              >
                {service.name}
              </span>
            </motion.div>
          ))}
      </div>
    );
  };

  // Render Officer Selection
  // const renderOfficerSelection = () => {
  //   if (officersLoading) {
  //     return (
  //       <div className="flex items-center justify-center py-4">
  //         <Skeleton className="h-10 w-full max-w-md" />
  //       </div>
  //     );
  //   }

  //   if (officersError) {
  //     return (
  //       <div className="text-center text-red-500 py-4">
  //         Failed to load officers. Please try again.
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="py-4">
  //       <Card className="bg-pink-[#fadee6] shadow-md border-pink-100">
  //         <CardContent className="p-4 mt-4">
  //           <h4 className="font-medium text-lg mb-4 text-center flex items-center justify-center gap-2">
  //             <UserRound className="h-5 w-5 text-[#E6007E]" />
  //             Select an Officer
  //           </h4>
  //           <Select onValueChange={handleOfficerSelect}>
  //             <SelectTrigger className="w-full bg-white">
  //               <SelectValue placeholder="Choose an officer" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {officers && officers.length > 0 ? (
  //                 officers.map((officer: Officer) => (
  //                   <SelectItem key={officer.id} value={officer.id}>
  //                     {officer.firstname} {officer.lastname}
  //                   </SelectItem>
  //                 ))
  //               ) : (
  //                 <SelectItem value="none" disabled>
  //                   No officers available
  //                 </SelectItem>
  //               )}
  //             </SelectContent>
  //           </Select>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6 text-center font-work-sans text-gray-800">
        {/* {organization.name} */}
      </h2>

      {/* Branch selection - only show when in branch step */}
      {localStep === "branch" && (
        <div className="mb-8">
          {/* <h3 className="text-xl font-semibold mb-4 text-center font-work-sans text-gray-800">
            Select a Branch
          </h3> */}
          {renderBranchSelection()}
        </div>
      )}

      {/* Service selection appears when in service step */}
      {localStep === "service" && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center font-work-sans text-gray-800">
            Services
          </h3>
          {renderServiceSelection()}

          {/* Officer selection after service selection */}
          {/* {selectedService && renderOfficerSelection()} */}

          {/* Show continue button if service is selected but no officer yet */}
          {/* {selectedService &&
            !selectedOfficer &&
            officers &&
            officers.length === 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  className="bg-[#E6007E] hover:bg-[#C4006C]"
                  onClick={() => {
                    setLocalStep("datetime");
                    if (onStepChange) onStepChange("datetime");
                  }}
                >
                  Continue Without Officer
                </Button>
              </div>
            )} */}
            <div className="flex justify-center mt-4">
                <Button
                  className="bg-[#E6007E] hover:bg-[#C4006C]"
                  onClick={() => {
                    setLocalStep("datetime");
                    if (onStepChange) onStepChange("datetime");
                  }}
                >
                  Continue
                </Button>
              </div>  
        </div>
      )}

      {/* Calendar overlay - positioned over the entire app */}
      {showCalendar && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Select a Date</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowCalendar(false)}
              >
                ✕
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              className="rounded-md border"
              disabled={(date) => {
                // Disable dates before today
                return date < new Date(new Date().setHours(0, 0, 0, 0));
              }}
            />
          </div>
        </div>
      )}

      {/* Date and Time selection appears when in datetime step */}
      {localStep === "datetime" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="overflow-y-auto max-h-[70vh] pb-4"
        >
          <h3 className="text-xl font-semibold mb-4 text-center font-work-sans text-gray-800">
            Select Date & Time
          </h3>

          <Card className="bg-pink-[#fadee6] shadow-md border-pink-200 mb-6">
            <CardContent className="p-4 mt-4">
              <h4 className="font-medium text-lg mb-3 text-center flex items-center justify-center gap-2">
                Select a Date
                <span
                  className="cursor-pointer text-[#E6007E] hover:text-[#C4006C]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCalendar(true);
                  }}
                >
                  <CalendarIcon className="h-5 w-5" />
                </span>
              </h4>
              <div
                className="overflow-x-auto scrollbar-hide py-2 mx-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                ref={dateScrollRef}
              >
                <div className="flex space-x-4 min-w-max px-4">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isToday = i === 0;
                    const isSelected =
                      selectedDate &&
                      date.getDate() === selectedDate.getDate() &&
                      date.getMonth() === selectedDate.getMonth();
                    const dayName = format(date, "EEE");
                    const dayNumber = format(date, "d");

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`cursor-pointer rounded-3xl flex flex-col items-center justify-center p-3 w-14 h-14 ${
                          isSelected
                            ? "bg-[#E6007E] text-white"
                            : "bg-white shadow-sm border border-pink-200 text-gray-800 hover:bg-pink-100"
                        }`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <span className="text-xs font-medium">{dayName}</span>
                        <span className="text-lg font-semibold">
                          {dayNumber}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedDate ? (
            <Card className="bg-pink-[#fadee6] shadow-md border-pink-200">
              <CardContent className="p-4 mt-4">
                <h4 className="font-medium text-lg mb-4 text-center">
                  Available Time Slots
                </h4>

                {timeSlotsLoading ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Morning</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton
                            key={`morning-${i}`}
                            className="h-16 w-full"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Afternoon</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton
                            key={`afternoon-${i}`}
                            className="h-16 w-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {groupedTimeSlots.morning.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Morning</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {groupedTimeSlots.morning.map((slot) => (
                            <Card
                              key={slot.time_from}
                              className={`cursor-pointer hover:shadow-md transition-all rounded-3xl ${
                                slot.remaining_slots === 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : "border border-pink-200 hover:bg-pink-100"
                              }`}
                              onClick={() =>
                                slot.remaining_slots > 0 &&
                                handleTimeSelect(slot)
                              }
                            >
                              <CardContent className="p-3 text-center">
                                <p className="font-medium text-lg">
                                  {formatTime(slot.time_from)}
                                </p>
                                <div className="flex items-center justify-center mt-1 text-sm">
                                  <Users className="h-3.5 w-3.5 mr-1 text-[#E6007E]" />
                                  <span>
                                    {slot.remaining_slots} slots available
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedTimeSlots.afternoon.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Afternoon</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {groupedTimeSlots.afternoon.map((slot) => (
                            <Card
                              key={slot.time_from}
                              className={`cursor-pointer hover:shadow-md transition-all rounded-3xl ${
                                slot.remaining_slots === 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : "border border-pink-200 hover:bg-pink-100"
                              }`}
                              onClick={() =>
                                slot.remaining_slots > 0 &&
                                handleTimeSelect(slot)
                              }
                            >
                              <CardContent className="p-3 text-center">
                                <p className="font-medium text-lg">
                                  {formatTime(slot.time_from)}
                                </p>
                                <div className="flex items-center justify-center mt-1 text-sm">
                                  <Users className="h-3.5 w-3.5 mr-1 text-[#E6007E]" />
                                  <span>
                                    {slot.remaining_slots} slots available
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedTimeSlots.morning.length === 0 &&
                      groupedTimeSlots.afternoon.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            No available time slots for this date.
                          </p>
                          <Button
                            className="mt-4 bg-[#E6007E] hover:bg-[#C4006C]"
                            onClick={() => setSelectedDate(undefined)}
                          >
                            Choose Another Date
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-500 my-8">
              Please select a date to view available time slots
            </div>
          )}
        </motion.div>
      )}

      {/* Confirmation Dialog - keep as is */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-work-sans font-gray-800">
              Confirm Your Reservation
            </DialogTitle>
            <DialogDescription className="font-work-sans font-gray-800">
              Please review your reservation details before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <img
                src={organization.logo || "/placeholder.svg"}
                alt={organization.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-medium font-work-sans font-gray-800">
                  {organization.name}
                </h4>
                <p className="text-sm text-muted-foreground font-work-sans font-gray-800">
                  {organization.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-b py-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-[#E6007E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium font-work-sans font-gray-800">
                    {selectedBranch?.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-work-sans font-gray-800">
                    {selectedBranch?.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-[#E6007E] shrink-0" />
                <p className="font-work-sans font-gray-800">
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : ""}
                </p>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#E6007E] shrink-0" />
                <p className="font-work-sans font-gray-800">
                  {selectedTime ? formatTime(selectedTime.time_from) : ""}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className={`bg-[#E6007E] hover:bg-[#C4006C] transition-all ${
                isProcessing ? "animate-pulse" : ""
              }`}
              onClick={handleConfirmReservation}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Confirm Reservation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog - keep as is */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-work-sans font-gray-800">
              Reservation Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 font-work-sans font-gray-800">
              Reservation Confirmed!
            </h2>
            <p className="text-muted-foreground mb-6 font-work-sans font-gray-800">
              Your appointment has been scheduled successfully. We've sent a
              confirmation to your email.
            </p>
            <p className="text-sm text-muted-foreground font-work-sans font-gray-800">
              Redirecting to home page...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
