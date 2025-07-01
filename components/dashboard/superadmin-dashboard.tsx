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
  Calendar,
  ChevronDown,
  ShoppingBag,
  Users,
  Utensils,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DonutChart,
  InteractivePieChart,
  PaddedPieChart,
  RadialBarChartComponent,
  SimplePieChart,
} from "@/components/charts/pie-charts";
import {
  GroupedBarChart,
  PositiveNegativeBarChart,
  StackedBarChart,
} from "@/components/charts/bar-charts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Organization, fetchAllOrganizations } from "@/lib/api/organization";
import {
  fetchAllReservations,
  BookedThroughChart,
  BookedThroughChartResponse,
  bookedThroughChart,
} from "@/lib/api/graphDatas";
import { Branch, BranchResponse, fetchAllBranches } from "@/lib/api/branch";

const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 4000 },
  { name: "Sep", value: 5000 },
  { name: "Oct", value: 6000 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 9000 },
];

const restaurantData = [
  {
    name: "confirmed",
    appointment_count: 302,
  },
  {
    name: "checked out",
    appointment_count: 1174,
  },
  {
    name: "checked in",
    appointment_count: 719,
  },
  {
    name: "expired",
    appointment_count: 444,
  },
];

const COLORS = ["#e6007e", "#8884d8", "#82ca9d", "#ffc658"];

const activities = [
  {
    icon: Building2,
    title: "New Organization Added",
    description: "Organization 'FoodTech Inc.' was added to the system",
    timestamp: "2 hours ago",
  },
  {
    icon: Users,
    title: "New Field Agent Onboarded",
    description: "Agent 'John Doe' was assigned to Branch 3",
    timestamp: "5 hours ago",
  },
  {
    icon: Utensils,
    title: "Restaurant Verification Completed",
    description: "Restaurant 'Tasty Bites' was verified and approved",
    timestamp: "1 day ago",
  },
  {
    icon: ShoppingBag,
    title: "Large Order Processed",
    description: "Order #1045 with 25 items was successfully processed",
    timestamp: "1 day ago",
  },
  {
    icon: Calendar,
    title: "Monthly Report Generated",
    description: "April 2025 system report is ready for review",
    timestamp: "2 days ago",
  },
];

// New chart data
const userRoleData = [
  { name: "Super Admin", value: 2 },
  { name: "Org Manager", value: 8 },
  { name: "Branch Manager", value: 15 },
  { name: "Field Agent", value: 45 },
  { name: "Restaurant Officer", value: 30 },
];

const userStatusData = [
  { name: "Active", value: 85 },
  { name: "Inactive", value: 15 },
];

const userGrowthData = [
  { name: "Jan", users: 65, newUsers: 15 },
  { name: "Feb", users: 75, newUsers: 10 },
  { name: "Mar", users: 85, newUsers: 10 },
  { name: "Apr", users: 90, newUsers: 5 },
  { name: "May", users: 100, newUsers: 10 },
];

const revenueGrowthData = [
  { name: "Jan", value: 15 },
  { name: "Feb", value: 20 },
  { name: "Mar", value: 35 },
  { name: "Apr", value: -10 },
  { name: "May", value: 25 },
  { name: "Jun", value: 30 },
];

const performanceData = [
  { name: "Team A", value: 85, fill: "#e6007e" },
  { name: "Team B", value: 70, fill: "#ff6ec4" },
  { name: "Team C", value: 65, fill: "#8884d8" },
  { name: "Team D", value: 90, fill: "#82ca9d" },
];

const branchPerformanceData = [
  { name: "Branch 1", orders: 120, revenue: 8500, profit: 2500 },
  { name: "Branch 2", orders: 98, revenue: 7200, profit: 2100 },
  { name: "Branch 3", orders: 86, revenue: 6400, profit: 1800 },
  { name: "Branch 4", orders: 99, revenue: 7300, profit: 2200 },
  { name: "Branch 5", orders: 85, revenue: 6200, profit: 1700 },
];

export function SuperAdminDashboard() {
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Fetch organizations and branches using React Query
  const { data: orgResponse, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchAllOrganizations,
  });

  const organizations = orgResponse || [];

  const { data: branchResponse, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchAllBranches,
  });

  const branches = branchResponse?.data || [];

  const { data: reservationResponse, isLoading: isLoadingReservations } =
    useQuery({
      queryKey: ["reservations"],
      queryFn: () =>
        fetchAllReservations(startDate, endDate, selectedBranch, selectedOrg),
    });

  console.log("The reservations are: ", reservationResponse);
  const reservationsData = reservationResponse?.data || [];

  // Filter branches based on selected organization
  const filteredBranches =
    selectedOrg === "all"
      ? branches
      : branches.filter(
          (branch: Branch) => branch.organization_id.toString() === selectedOrg
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        {/* <h1 className="text-2xl font-bold">Dashboard Overview</h1> */}

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex flex-1 sm:flex-row gap-2">
            <Select
              value={selectedOrg}
              onValueChange={setSelectedOrg}
              disabled={isLoadingOrgs}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org: Organization) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBranch}
              onValueChange={setSelectedBranch}
              disabled={isLoadingBranches}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {filteredBranches?.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[180px] justify-start text-left font-normal"
                >
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>From Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[180px] justify-start text-left font-normal"
                >
                  {endDate ? format(endDate, "PPP") : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Organizations"
          value={12}
          icon={Building2}
          change={{ value: 16.7, trend: "up" }}
        />
        <StatCard
          title="Total Branches"
          value={48}
          icon={Building2}
          change={{ value: 10.4, trend: "up" }}
        />
        <StatCard
          title="Total Reservations"
          value={256}
          icon={Utensils}
          change={{ value: 9.4, trend: "up" }}
        />
        <StatCard
          title="Total Checkout"
          value={1024}
          icon={ShoppingBag}
          change={{ value: 25, trend: "up" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatedGradientBorder>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Reservations Overview
                </CardTitle>
                <CardDescription>Reservations Overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={restaurantData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0.5}
                        dataKey="appointment_count"
                      >
                        {restaurantData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  User Roles Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={userRoleData}
                  colors={[
                    "#e6007e",
                    "#ff6ec4",
                    "#8884d8",
                    "#82ca9d",
                    "#ffc658",
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  User Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={userStatusData}
                  colors={["#e6007e", "#d3d3d3"]}
                  height={250}
                />
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractivePieChart
                  data={[
                    { name: "Mobile App", value: 45 },
                    { name: "Website", value: 30 },
                    { name: "Phone Call", value: 15 },
                    { name: "In Person", value: 10 },
                  ]}
                  colors={["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d"]}
                  height={250}
                />
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Restaurant Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaddedPieChart
                  data={[
                    { name: "Fast Food", value: 35 },
                    { name: "Casual Dining", value: 25 },
                    { name: "Fine Dining", value: 15 },
                    { name: "Cafes", value: 25 },
                  ]}
                  colors={["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d"]}
                  height={250}
                />
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadialBarChartComponent data={performanceData} height={250} />
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, i) => (
                    <ActivityItem
                      key={i}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        ></motion.div>
      </div>
    </div>
  );
}
