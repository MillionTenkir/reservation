"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { motion } from "framer-motion"
import { ShoppingBag, TrendingUp, Users, Utensils } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonutChart, InteractivePieChart, PaddedPieChart, SimplePieChart } from "@/components/charts/pie-charts"
import { CustomShapeBarChart, GroupedBarChart, SimpleBarChart } from "@/components/charts/bar-charts"

// Update the agentPerformanceData with more realistic values
const agentPerformanceData = [
  { name: "Agent 1", orders: 65, restaurants: 8 },
  { name: "Agent 2", orders: 48, restaurants: 6 },
  { name: "Agent 3", orders: 52, restaurants: 7 },
  { name: "Agent 4", orders: 42, restaurants: 5 },
  { name: "Agent 5", orders: 30, restaurants: 6 },
]

// Update the restaurantTypeData with more realistic values
const restaurantTypeData = [
  { name: "Fast Food", value: 45 },
  { name: "Casual Dining", value: 35 },
  { name: "Fine Dining", value: 5 },
  { name: "Cafes", value: 15 },
]

// Update the orderStatusData with more realistic values
const orderStatusData = [
  { name: "Completed", value: 70 },
  { name: "Processing", value: 15 },
  { name: "Pending", value: 10 },
  { name: "Cancelled", value: 5 },
]

// Update the customerSatisfactionData with more realistic values
const customerSatisfactionData = [
  { name: "Very Satisfied", value: 55 },
  { name: "Satisfied", value: 30 },
  { name: "Neutral", value: 10 },
  { name: "Dissatisfied", value: 5 },
]

// Update the dailyRevenueData with more realistic values
const dailyRevenueData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 900 },
  { name: "Wed", value: 1500 },
  { name: "Thu", value: 1300 },
  { name: "Fri", value: 2200 },
  { name: "Sat", value: 2500 },
  { name: "Sun", value: 1800 },
]

// Update the hourlyOrdersData with more realistic values
const hourlyOrdersData = [
  { hour: "8 AM", orders: 5 },
  { hour: "9 AM", orders: 8 },
  { hour: "10 AM", orders: 12 },
  { hour: "11 AM", orders: 18 },
  { hour: "12 PM", orders: 24 },
  { hour: "1 PM", orders: 22 },
  { hour: "2 PM", orders: 18 },
  { hour: "3 PM", orders: 15 },
  { hour: "4 PM", orders: 12 },
  { hour: "5 PM", orders: 10 },
  { hour: "6 PM", orders: 15 },
  { hour: "7 PM", orders: 20 },
  { hour: "8 PM", orders: 18 },
  { hour: "9 PM", orders: 12 },
]

const orderData = [
  { day: "Mon", orders: 24 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 32 },
  { day: "Thu", orders: 27 },
  { day: "Fri", orders: 45 },
  { day: "Sat", orders: 52 },
  { day: "Sun", orders: 39 },
]

const activities = [
  {
    icon: Users,
    title: "New Field Agent Assigned",
    description: "Michael Brown has joined your branch team",
    timestamp: "2 hours ago",
  },
  {
    icon: Utensils,
    title: "Restaurant Verification",
    description: "Restaurant 'Spice Garden' has been verified",
    timestamp: "5 hours ago",
  },
  {
    icon: ShoppingBag,
    title: "Large Order Alert",
    description: "Order #1089 with 15 items needs attention",
    timestamp: "1 day ago",
  },
]

// Fix the AreaChart gradient issue
const areaChartGradientFix = `
<defs>
  <linearGradient id="colorRestaurants" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#e6007e" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#e6007e" stopOpacity={0.1} />
  </linearGradient>
  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
  </linearGradient>
</defs>
`

export function BranchManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Field Agents" value={8} icon={Users} change={{ value: 14.3, trend: "up" }} />
        <StatCard title="Restaurants" value={32} icon={Utensils} change={{ value: 6.7, trend: "up" }} />
        <StatCard title="Weekly Orders" value={237} icon={ShoppingBag} change={{ value: 12.8, trend: "up" }} />
        <StatCard
          title="Avg. Order Value"
          value={42.75}
          icon={TrendingUp}
          decimal={true}
          prefix="$"
          change={{ value: 3.5, trend: "up" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AnimatedGradientBorder>
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Weekly Order Trend</CardTitle>
                <CardDescription>Orders processed per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={orderData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#e6007e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatedGradientBorder>
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Agent Performance</CardTitle>
                <CardDescription>Restaurants and orders by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={agentPerformanceData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="restaurants"
                        stroke="#e6007e"
                        fill="url(#colorRestaurants)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#8884d8"
                        fill="url(#colorOrders)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorRestaurants" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e6007e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#e6007e" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AnimatedGradientBorder>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Advanced Analytics</CardTitle>
              <CardDescription>Detailed visualization of branch data</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pie-charts">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pie-charts">Pie Charts</TabsTrigger>
                  <TabsTrigger value="bar-charts">Bar Charts</TabsTrigger>
                </TabsList>

                <TabsContent value="pie-charts" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Restaurant Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SimplePieChart
                          data={restaurantTypeData}
                          colors={["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d"]}
                          height={250}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Order Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DonutChart
                          data={orderStatusData}
                          colors={["#4caf50", "#e6007e", "#ff9800", "#f44336"]}
                          height={250}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PaddedPieChart
                          data={customerSatisfactionData}
                          colors={["#4caf50", "#8bc34a", "#ffeb3b", "#f44336"]}
                          height={250}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Agent Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <InteractivePieChart
                          data={agentPerformanceData.map((item) => ({
                            name: item.name,
                            value: item.orders,
                          }))}
                          colors={["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d", "#ffc658"]}
                          height={250}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="bar-charts" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SimpleBarChart data={dailyRevenueData} color="#e6007e" height={300} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Agent Performance Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <GroupedBarChart
                          data={agentPerformanceData}
                          keys={[
                            { key: "orders", color: "#e6007e" },
                            { key: "restaurants", color: "#8884d8" },
                          ]}
                          height={250}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Hourly Order Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CustomShapeBarChart
                          data={hourlyOrdersData.map((item) => ({
                            name: item.hour,
                            value: item.orders,
                          }))}
                          colors={["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d"]}
                          height={250}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest actions in your branch</CardDescription>
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
    </div>
  )
}
