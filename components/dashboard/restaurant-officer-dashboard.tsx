"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { motion } from "framer-motion"
import { DollarSign, ShoppingBag, Star, Utensils } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const orderData = [
  { time: "8 AM", orders: 5 },
  { time: "9 AM", orders: 8 },
  { time: "10 AM", orders: 12 },
  { time: "11 AM", orders: 18 },
  { time: "12 PM", orders: 24 },
  { time: "1 PM", orders: 22 },
  { time: "2 PM", orders: 18 },
  { time: "3 PM", orders: 15 },
  { time: "4 PM", orders: 12 },
  { time: "5 PM", orders: 10 },
  { time: "6 PM", orders: 15 },
  { time: "7 PM", orders: 20 },
  { time: "8 PM", orders: 18 },
  { time: "9 PM", orders: 12 },
  { time: "10 PM", orders: 8 },
]

const activities = [
  {
    icon: ShoppingBag,
    title: "New Order Received",
    description: "Order #1092 with 3 items has been received",
    timestamp: "Just now",
  },
  {
    icon: ShoppingBag,
    title: "Order Completed",
    description: "Order #1089 has been successfully delivered",
    timestamp: "30 minutes ago",
  },
  {
    icon: Star,
    title: "New Review",
    description: "Customer left a 5-star review for Order #1085",
    timestamp: "2 hours ago",
  },
]

export function RestaurantOfficerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Orders" value={42} icon={ShoppingBag} change={{ value: 12.5, trend: "up" }} />
        <StatCard
          title="Avg. Order Value"
          value={38.5}
          icon={DollarSign}
          decimal={true}
          prefix="$"
          change={{ value: 3.8, trend: "up" }}
        />
        <StatCard title="Customer Rating" value={4.8} icon={Star} decimal={true} change={{ value: 2.1, trend: "up" }} />
        <StatCard title="Menu Items" value={24} icon={Utensils} change={{ value: 0, trend: "neutral" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AnimatedGradientBorder>
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Today's Order Trend</CardTitle>
              <CardDescription>Orders received throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={orderData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#e6007e" fill="url(#colorOrders)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e6007e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#e6007e" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
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
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest order activities</CardDescription>
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
