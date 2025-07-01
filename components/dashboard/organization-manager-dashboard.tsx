"use client";

import { ActivityItem } from "@/components/ui/activity-item";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarArrowDown,
  ShoppingBag,
  Star,
  TicketCheck,
  Users,
  Utensils,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DonutChart,
  InteractivePieChart,
  PaddedPieChart,
  SimplePieChart,
} from "@/components/charts/pie-charts";
import {
  fetchStatCardReportData,
  fetchServiceReportData,
  fetchBookedThroughReportData,
  fetchDailyAppointmentReportData,
} from "@/lib/api/reportData";
import { useQuery } from "@tanstack/react-query";

// Generate mock ratings distribution
const ratingsDistribution = {
  5: 18141,
  4: 4172,
  3: 3133,
  2: 1130,
  1: 1551,
};

// Calculate total ratings
const totalRatings = Object.values(ratingsDistribution).reduce(
  (a, b) => a + b,
  0
);

// Calculate average rating
const weightedSum = Object.entries(ratingsDistribution).reduce(
  (sum, [rating, count]) => sum + Number(rating) * count,
  0
);
const averageRating = (weightedSum / totalRatings).toFixed(2);

const branchPerformance = [
  { name: "Branch 1", orders: 120, revenue: 8500 },
  { name: "Branch 2", orders: 98, revenue: 7200 },
  { name: "Branch 3", orders: 86, revenue: 6400 },
  { name: "Branch 4", orders: 99, revenue: 7300 },
  { name: "Branch 5", orders: 85, revenue: 6200 },
];

const activities = [
  {
    icon: Building2,
    title: "New Branch Added",
    description: "Branch 'Downtown' was added to your organization",
    timestamp: "3 hours ago",
  },
  {
    icon: Users,
    title: "New Branch Manager Assigned",
    description: "Sarah Johnson is now managing Branch 3",
    timestamp: "1 day ago",
  },
  {
    icon: Utensils,
    title: "Restaurant Onboarding",
    description: "5 new restaurants were added to Branch 2",
    timestamp: "2 days ago",
  },
  {
    icon: ShoppingBag,
    title: "Order Milestone Reached",
    description: "Your organization has processed over 10,000 orders",
    timestamp: "1 week ago",
  },
];

// Update the branchManagerData with more realistic values
const branchManagerData = [
  { name: "Branch 1", manager: "Call Center", performance: 92 },
  { name: "Branch 2", manager: "Self", performance: 85 },
];

// Update the orderStatusData with more realistic values
const orderStatusData = [
  { name: "Completed", value: 65 },
  { name: "Checked In", value: 20 },
  { name: "Expired", value: 10 },
  { name: "Cancelled", value: 5 },
];

const serviceStatusData = [
  { name: "Massage", value: 123 },
  { name: "Spa", value: 189 },
  { name: "Hair", value: 200 },
  { name: "Nail Polish", value: 95 },
];

// Update the monthlyRevenueData with more realistic values
const monthlyRevenueData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 15 },
  { name: "Mar", value: 25 },
  { name: "Apr", value: -5 },
  { name: "May", value: 20 },
];

export function OrganizationManagerDashboard() {
  const { data: reportData } = useQuery({
    queryKey: ["reportData"],
    queryFn: fetchStatCardReportData,
  });
  console.log("reportData", reportData);
  const { data: serviceReportData } = useQuery({
    queryKey: ["serviceReportData"],
    queryFn: fetchServiceReportData,
  });
  console.log("serviceReportData", serviceReportData);
  const { data: bookedThroughReportData } = useQuery({
    queryKey: ["bookedThroughReportData"],
    queryFn: fetchBookedThroughReportData,
  });
  console.log("bookedThroughReportData", bookedThroughReportData);
  const { data: dailyAppointmentReportData } = useQuery({
    queryKey: ["dailyAppointmentReportData"],
    queryFn: fetchDailyAppointmentReportData,
  });
  console.log("dailyAppointmentReportData", dailyAppointmentReportData);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          title="Total Reservations"
          value={243}
          icon={CalendarArrowDown}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
        />
        <StatCard
          title="Queue"
          value={45}
          icon={Users}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <StatCard
          title="Completed"
          value={87}
          icon={TicketCheck}
          className="bg-gradient-to-r from-[#076691] to-[#b1efcd] text-white"
        />
        <StatCard
          title="Cancelled"
          value={20}
          icon={ShoppingBag}
          className="bg-gradient-to-r from-[#076691] to-gray-100 text-white"
        />
      </div>

      <motion.div>
        <AnimatedGradientBorder>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  <h1 className="text-center text-[17px] text-gray-800">
                    Reservation Status
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={orderStatusData}
                  colors={["#ff8042", "#00c49f", "#ffbb28", "#808080"]}
                  title="Reservations"
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  <h1 className="text-center text-[17px]">Service Report</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={serviceStatusData}
                  title="Services"
                  colors={[
                    "#e69b1c",
                    "#e61c5f",
                    "#e67373",
                    "#0088fa",
                    "#000000",
                    "#1ce61f",
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  <h1 className="text-center text-[17px] text-gray-800">
                    Booked Through
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractivePieChart
                  data={branchManagerData.map((item) => ({
                    name: item.manager,
                    value: item.performance,
                  }))}
                  colors={["#0088fe", "#ffbb28"]}
                  height={270}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  <h1 className="text-center text-[17px] text-gray-800">
                    Daily Reservations
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Mon", completed: 65, checkedIn: 180 },
                        { month: "Tue", completed: 72, checkedIn: 195 },
                        { month: "Wed", completed: 78, checkedIn: 210 },
                        { month: "Thu", completed: 85, checkedIn: 235 },
                        { month: "Fri", completed: 90, checkedIn: 256 },
                        { month: "Sat", completed: 100, checkedIn: 280 },
                        { month: "Sun", completed: 120, checkedIn: 278 },
                      ]}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        fill="#f081e7"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="checkedIn"
                        fill="#30f254"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm max-w-5xl w-full">
              <CardHeader className="pb-2">
                <CardTitle>
                  <h1 className="text-center text-[17px] text-gray-800">
                    Ratings & Reviews
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <h2 className="text-5xl font-bold">
                    {averageRating}{" "}
                    <span className="text-2xl text-muted-foreground">/ 5</span>
                  </h2>
                  <div className="flex my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= Math.round(Number(averageRating))
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    {totalRatings.toLocaleString()} Ratings
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Ratings Summary</h3>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center w-16">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{rating}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full"
                          style={{
                            width: `${
                              (ratingsDistribution[
                                rating as keyof typeof ratingsDistribution
                              ] /
                                totalRatings) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {ratingsDistribution[
                          rating as keyof typeof ratingsDistribution
                        ].toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-center">
                  <h1 className="text-center text-[17px] text-gray-800 ">
                    Monthly Reservations
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { date: "Jan", callcenter: 40, self: 24, Total: 64 },
                        { date: "Feb", callcenter: 30, self: 28, Total: 58 },
                        { date: "Mar", callcenter: 45, self: 35, Total: 80 },
                        { date: "Apr", callcenter: 35, self: 30, Total: 65 },
                        { date: "Jun", callcenter: 50, self: 45, Total: 95 },
                        { date: "Jul", callcenter: 65, self: 55, Total: 120 },
                        { date: "Aug", callcenter: 60, self: 50, Total: 110 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="callcenter"
                        stackId="a"
                        fill="#8884d8"
                        name="Call Center"
                      />
                      <Bar
                        dataKey="self"
                        stackId="a"
                        fill="#82ca9d"
                        name="Self Service"
                      />
                      <Bar dataKey="Total" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="my-10">
            <Card className="mx-auto max-w-7xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">
                  <h1 className="text-center text-[17px] text-gray-800">
                    Employees performance
                  </h1>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Metrics of top performing employees.
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-7xl h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Soreti Employee1",
                          Services: 202,
                          "5-Star": 167,
                          actions: 134,
                        },
                        {
                          name: "Soreti Employee2",
                          Services: 187,
                          "5-Star": 110,
                          actions: 78,
                        },
                        {
                          name: "Soreti Employee3",
                          Services: 173,
                          "5-Star": 73,
                          actions: 150,
                        },
                        {
                          name: "Soreti Employee4",
                          Services: 165,
                          "5-Star ": 100,
                          actions: 89,
                        },
                        {
                          name: "Soreti Employee5",
                          Services: 183,
                          "5-Star": 83,
                          actions: 120,
                        },
                        {
                          name: "Soreti Employee6",
                          Services: 178,
                          "5-Star": 78,
                          actions: 134,
                        },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 50,
                      }}
                      barGap={2}
                      barCategoryGap={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="name"
                        angle={-20}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 240]} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "Services")
                            return [`${value}`, "Services Checked Out"];
                          if (name === "5-Star")
                            return [`${value}`, "5-Star Submitted"];
                          return [`${value}`, "Total Actions"];
                        }}
                        labelFormatter={(label) => `Agent: ${label}`}
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #ccc",
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          if (value === "Services") return "Services Given";
                          if (value === "5-Star") return "5-Star Submitted";
                          return "Total Actions";
                        }}
                      />
                      <Bar
                        dataKey="Services"
                        fill="#9575cd"
                        radius={[4, 4, 0, 0]}
                        name="Services"
                      />
                      <Bar
                        dataKey="5-Star"
                        fill="#81c784"
                        radius={[4, 4, 0, 0]}
                        name="5-Star"
                      />
                      <Bar
                        dataKey="actions"
                        fill="#4fc3f7"
                        radius={[4, 4, 0, 0]}
                        name="actions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="my-10">
            <Card className="mx-auto max-w-7xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">
                  <h1 className="text-center text-[17px] text-gray-800">
                    Employee Performance accross time Period
                  </h1>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Appointment metrics by officer across different time
                    periods.
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-7xl h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Mihret Buzayehu",
                          Today: 150,
                          "This Week": 350,
                          "This Month": 450,
                          "Total Appointments": 2400,
                        },
                        {
                          name: "Dinkesa Chandu",
                          Today: 120,
                          "This Week": 180,
                          "This Month": 250,
                          "Total Appointments": 1100,
                        },
                        {
                          name: "Gudeta Dalesa",
                          Today: 130,
                          "This Week": 200,
                          "This Month": 300,
                          "Total Appointments": 1600,
                        },
                        {
                          name: "Adamu Ejeta",
                          Today: 110,
                          "This Week": 210,
                          "This Month": 320,
                          "Total Appointments": 1400,
                        },
                        {
                          name: "Gebi Gerbi",
                          Today: 140,
                          "This Week": 190,
                          "This Month": 350,
                          "Total Appointments": 1450,
                        },
                        {
                          name: "Demekash Legesse",
                          Today: 100,
                          "This Week": 150,
                          "This Month": 280,
                          "Total Appointments": 1100,
                        },
                        {
                          name: "Melaku Mekonnen",
                          Today: 125,
                          "This Week": 170,
                          "This Month": 400,
                          "Total Appointments": 1400,
                        },
                        {
                          name: "Meaza Temsil",
                          Today: 130,
                          "This Week": 195,
                          "This Month": 350,
                          "Total Appointments": 1650,
                        },
                        {
                          name: "Temene Tiroiba",
                          Today: 115,
                          "This Week": 160,
                          "This Month": 290,
                          "Total Appointments": 1250,
                        },
                        {
                          name: "Birtukan Wodajeneh",
                          Today: 125,
                          "This Week": 185,
                          "This Month": 330,
                          "Total Appointments": 1600,
                        },
                        {
                          name: "Sable Wirkissa",
                          Today: 150,
                          "This Week": 175,
                          "This Month": 280,
                          "Total Appointments": 1050,
                        },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 50,
                      }}
                      barGap={2}
                      barCategoryGap={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="name"
                        angle={-20}
                        textAnchor="end"
                        height={100}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 2500]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Today"
                        fill="#66cdaa"
                        radius={[0, 0, 0, 0]}
                        name="Today"
                      />
                      <Bar
                        dataKey="This Week"
                        fill="#b19cd9"
                        radius={[0, 0, 0, 0]}
                        name="This Week"
                      />
                      <Bar
                        dataKey="This Month"
                        fill="#ffb347"
                        radius={[0, 0, 0, 0]}
                        name="This Month"
                      />
                      <Bar
                        dataKey="Total Appointments"
                        fill="#ff6b81"
                        radius={[0, 0, 0, 0]}
                        name="Total Appointments"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedGradientBorder>
      </motion.div>
    </div>
  );
}
