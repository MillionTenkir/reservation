"use client";

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
  fetchReservations,
  addToQueue,
} from "@/lib/api/reservations";
import { Reservation } from "@/lib/api/reservations";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  Star,
  Utensils,
  Search,
  TicketCheck,
  Users,
  CalendarArrowDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const restaurantData = [
  { name: "Restaurant 1", rating: 4.8, orders: 28 },
  { name: "Restaurant 2", rating: 4.5, orders: 22 },
  { name: "Restaurant 3", rating: 4.2, orders: 18 },
  { name: "Restaurant 4", rating: 4.7, orders: 25 },
  { name: "Restaurant 5", rating: 4.3, orders: 20 },
  { name: "Restaurant 6", rating: 4.6, orders: 24 },
  { name: "Restaurant 7", rating: 4.4, orders: 21 },
];

export function FieldAgentDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const { toast } = useToast();

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ["reservations", searchTerm, date],
    queryFn: () => fetchReservations(searchTerm, date),
  });

  console.log("the reservationsData", reservationsData);

  // Function to handle check-in
  const handleCheckIn = async (reservation: Reservation) => {
    console.log("Checking in reservation:", reservation);
    console.log("Full data:", JSON.stringify(reservation?.fullData, null, 2));

    try {
      // Use the passed reservation parameter
      if (reservation && "fullData" in reservation) {
        await addToQueue(reservation.fullData);
        toast({
          title: "Check-in successful",
          description: `${reservation.fullName} has been added to the queue.`,
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["reservations"] });
      } else {
        // For basic reservations without fullData, show error
        console.error("Cannot check in: Missing required reservation data");
        toast({
          title: "Check-in failed",
          description: "Missing required reservation data.",
          variant: "destructive",
        });
        return;
      }

      console.log(`Successfully checked in: ${reservation.fullName}`);
      // Refresh reservations data after successful check-in
      // You might want to trigger a refetch of your reservations
    } catch (error) {
      console.error("Failed to check in:", error);
      toast({
        title: "Check-in failed",
        description: "There was an error adding to the queue.",
        variant: "destructive",
      });
    }
  };

  console.log("the selectedReservation", selectedReservation);
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Check In</h1>
        </div>
        <p className="text-muted-foreground">Check In Reservations.</p>
      </motion.div>
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
        {isLoading ? (
          // Loading skeletons
          Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden">
                <CardHeader className="pb-2">
                  {/* <Skeleton className="h-6 w-3/4" /> */}
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      {/* <Skeleton className="h-4 w-1/4" /> */}
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex justify-between">
                      {/* <Skeleton className="h-4 w-1/4" /> */}
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex justify-between">
                      {/* <Skeleton className="h-4 w-1/4" /> */}
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))
        ) : reservationsData && reservationsData?.length === 0 ? (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <p className="text-xl font-medium text-muted-foreground">
              No Reservations Currently
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or check back later
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
                    {reservation.fullName}
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
                          Check In
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Check-In</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to check in{" "}
                            {reservation.fullName}?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>
                            <strong>Name:</strong> {reservation.fullName}
                          </p>
                          <p>
                            <strong>CNR:</strong> {reservation.cnr}
                          </p>
                          <p>
                            <strong>Date:</strong> {reservation.date}
                          </p>
                          <p>
                            <strong>Time:</strong> {reservation.appointmentTime}
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
                            <Button onClick={() => handleCheckIn(reservation)}>
                              Confirm Check-In
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
  );
}
