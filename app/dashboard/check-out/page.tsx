"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";

import { ActivityItem } from "@/components/ui/activity-item";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import {
  getReservations,
  fetchReservationsToCheckOut,
} from "@/lib/api/reservations";
import { Reservation, Reservationdummy } from "@/lib/api/reservations";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  Star,
  Utensils,
  Search,
  CalendarArrowDown,
  Users,
  TicketCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

// Dummy reservation data for showcase
// const dummyReservations: Reservationdummy[] = [
//   {
//     id: "1",
//     fullName: "John Doe",
//     date: "2023-08-15",
//     time: "18:30",
//     service: "Dinner Reservation",
//     cnr: "ABC123",
//   },
//   {
//     id: "2",
//     fullName: "Jane Smith",
//     date: "2023-08-15",
//     time: "19:00",
//     service: "Business Meeting",
//     cnr: "DEF456",
//   },
//   {
//     id: "3",
//     fullName: "Robert Johnson",
//     date: "2023-08-16",
//     time: "12:30",
//     service: "Lunch Reservation",
//     cnr: "GHI789",
//   },
//   {
//     id: "4",
//     fullName: "Emily Davis",
//     date: "2023-08-16",
//     time: "20:00",
//     service: "Birthday Celebration",
//     cnr: "JKL012",
//   },
//   {
//     id: "5",
//     fullName: "Michael Wilson",
//     date: "2023-08-17",
//     time: "17:30",
//     service: "Corporate Event",
//     cnr: "MNO345",
//   },
// ];

export default function CheckOutPage() {
  const { isAuthorized, isAdminLoading } = useRoleGuard([
    "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
  ]);

  if (isAdminLoading) {
    return <RoleGuardLoading />;
  }
  if (!isAuthorized) {
    return null;
  }

  const [searchTerm, setSearchTerm] = useState("");
  // const [reservations, setReservations] =  useState<Reservation[]>(dummyReservations);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const { data: reservationsData, isLoading: isLoadingReservations } = useQuery(
    {
      queryKey: ["reservationsCheckout", searchTerm],
      queryFn: () => fetchReservationsToCheckOut(searchTerm),
    }
  );

  console.log("reservationsData Checkout", reservationsData);

  // Filter reservations based on search term
  // const filteredReservations = reservations.filter(
  //   (reservation) =>
  //     reservation.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     reservation.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     reservation.cnr.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Function to handle check-in
  const handleCheckOut = (reservation: Reservation) => {
    console.log(`Checked out: ${reservation.fullName}`);
    // Here you would implement the actual check-out API call
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
          <h1 className="text-3xl font-bold tracking-tight">Check Out</h1>
        </div>
        <p className="text-muted-foreground">Check Out Reservations.</p>
      </motion.div>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reservations"
            value={243}
            icon={CalendarArrowDown}
            className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
            // change={{ value: 25, trend: "up" }}
          />
          <StatCard
            title="Queue"
            value={45}
            icon={Users}
            // change={{ value: 25, trend: "up" }}
            className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
          />
          <StatCard
            title="Completed"
            value={87}
            icon={TicketCheck}
            // change={{ value: 12.4, trend: "up" }}
            className="bg-gradient-to-r from-[#076691] to-[#b1efcd] text-white"
          />
          <StatCard
            title="Cancelled"
            value={20}
            icon={ShoppingBag}
            // change={{ value: 8.7, trend: "up" }}
            className="bg-gradient-to-r from-[#076691] to-gray-100 text-white"
          />
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search reservations by name, service or CNR..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Reservations Grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoadingReservations ? (
            // Loading skeletons
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Card key={`loading-${index}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-9 w-full mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : reservationsData?.length === 0 ? (
            // Empty state message
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                No Reservations Currently
              </h3>
              <p className="text-muted-foreground mt-2">
                There are no reservations ready for check-out at this time.
              </p>
            </div>
          ) : (
            // Reservation cards
            reservationsData?.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {reservation?.user?.firstname} {reservation?.user?.lastname}
                    </CardTitle>
                    <CardDescription>CNR: {reservation.cnr}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Date:
                        </span>
                        <span className="text-sm font-medium">
                          {reservation.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Time:
                        </span>
                        <span className="text-sm font-medium">
                          {reservation.appointmentTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Service:
                        </span>
                        <span className="text-sm font-medium">
                          {reservation.service}
                        </span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full mt-4"
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            Check Out
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Check-Out</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to check out{" "}
                              {reservation.fullName}?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p>
                              <strong>CNR:</strong> {reservation.cnr}
                            </p>
                            <p>
                              <strong>Date:</strong> {reservation.date}
                            </p>
                            <p>
                              <strong>Time:</strong> {reservation.time}
                            </p>
                            <p>
                              <strong>Service:</strong> {reservation.service}
                            </p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={() => handleCheckOut(reservation)}
                              >
                                Confirm Check-Out
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
