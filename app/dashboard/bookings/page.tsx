"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { fetchServicesByBranch } from "@/lib/api/service";
import { useAuth } from "@/context/auth-context";
import { fetchOfficers } from "@/lib/api/officers";

// Define types for our data
interface ReservationData {
  services: string[];
  employee: string;
  firstName: string;
  lastName: string;
  mobile: string;
  appointmentDate: string;
}

interface Service {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
}

export default function BookingPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc","01bf91c3-abb9-4c5c-8b84-364dd28e8688"
  ]);

  const { user } = useAuth();
  const branchId = user?.branch_id;
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    services: [],
    employee: "",
    firstName: "",
    lastName: "",
    mobile: "",
    appointmentDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: servicesData, isLoading: isServicesLoading } = useQuery({
    queryKey: ["services", branchId],
    queryFn: () =>
      branchId ? fetchServicesByBranch(branchId) : Promise.resolve([]),
    enabled: !!branchId,
  });

  console.log("servicesData", servicesData);

  const { data: officersData, isLoading: isOfficersLoading } = useQuery({
    queryKey: ["officers", reservationData.services],
    queryFn: fetchOfficers,
    enabled: reservationData.services.length > 0,
  });

  console.log("officersData", officersData);

  const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    mobile: z.string().min(10, { message: "Valid mobile number is required" }),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
    },
  });

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleServiceToggle = (serviceId: string) => {
    setReservationData((prev) => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];

      return { ...prev, services: newServices };
    });
  };

  const handleServiceSelectionComplete = () => {
    if (reservationData.services.length > 0) {
      handleNextStep();
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setReservationData((prev) => ({ ...prev, employee: employeeId }));
    handleNextStep();
  };

  const onSubmit = (data: FormData) => {
    const finalData = {
      ...reservationData,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
    };

    setReservationData(finalData);
    handleNextStep();
  };

  const handleConfirm = () => {
    console.log("Reservation Data:", reservationData);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setStep(1);
    setReservationData({
      services: [],
      employee: "",
      firstName: "",
      lastName: "",
      mobile: "",
      appointmentDate: format(new Date(), "yyyy-MM-dd"),
    });
    form.reset();
  };

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select Services</h2>
              <p className="text-muted-foreground mb-4">
                You can select multiple services
              </p>
              <div className="grid grid-cols-1 gap-3">
                {servicesData?.map((service) => (
                  <div
                    key={service.id}
                    className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors ${
                      reservationData.services.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <Checkbox
                      checked={reservationData.services.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <span>{service.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleServiceSelectionComplete}
                  disabled={reservationData.services.length === 0}
                  className="w-full"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select an Employee</h2>
              <div className="grid grid-cols-1 gap-3">
                {officersData?.map((employee) => (
                  <Button
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee.id)}
                    className="justify-start h-auto py-4"
                    variant="outline"
                  >
                    {employee.name}
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your mobile number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button type="submit">Next</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      case 4:
        const selectedServiceNames = reservationData.services.map(
          (serviceId) =>
            servicesData?.find((s) => s.id === serviceId)?.name || ""
        );
        const selectedEmployee =
          officersData?.find((e) => e.id === reservationData.employee)?.name ||
          "";

        return (
          <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                Confirm Reservation
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Services:</span>
                  <div className="flex flex-col">
                    {selectedServiceNames.map((name, index) => (
                      <span key={index} className="py-0.5">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Employee:</span>
                  <span>{selectedEmployee}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Name:</span>
                  <span>
                    {reservationData.firstName} {reservationData.lastName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Mobile:</span>
                  <span>{reservationData.mobile}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium">Date:</span>
                  <span>{reservationData.appointmentDate}</span>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button onClick={handleConfirm}>Confirm Reservation</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Book</h1>
        </div>
        <p className="text-muted-foreground">Make Reservation for walkin.</p>
      </motion.div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg">{renderStepContent()}</div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your reservation has been confirmed. We look forward to seeing
                you!
              </p>
              <Button onClick={closeSuccessModal} className="w-full">
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
