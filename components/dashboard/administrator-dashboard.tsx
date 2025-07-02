"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { motion } from "framer-motion"
import { Building2, Clock, Settings, Users, Utensils } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const userDistribution = [
  { name: "Super Admin", value: 1 },
  { name: "Org Managers", value: 5 },
  { name: "Branch Managers", value: 12 },
  { name: "Field Agents", value: 48 },
  { name: "Restaurant Officers", value: 24 },
]

const COLORS = ["#e6007e", "#ff6ec4", "#8884d8", "#82ca9d", "#ffc658"]

const activities = [
  {
    icon: Users,
    title: "New User Created",
    description: "You created a new Branch Manager account",
    timestamp: "1 hour ago",
  },
  {
    icon: Settings,
    title: "System Settings Updated",
    description: "You updated notification preferences",
    timestamp: "3 hours ago",
  },
  {
    icon: Building2,
    title: "Organization Added",
    description: "You added 'Food Express Inc.' to the system",
    timestamp: "Yesterday",
  },
]

export function AdministratorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={90} icon={Users} change={{ value: 8.4, trend: "up" }} />
        <StatCard title="Organizations" value={12} icon={Building2} change={{ value: 16.7, trend: "up" }} />
        <StatCard title="Restaurants" value={256} icon={Utensils} change={{ value: 9.4, trend: "up" }} />
        <StatCard
          title="System Uptime"
          value={99.8}
          icon={Clock}
          decimal={true}
          unit="%"
          change={{ value: 0.2, trend: "up" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <AnimatedGradientBorder>
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">System Growth</CardTitle>
                <CardDescription>Users and restaurants over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", users: 65, restaurants: 180 },
                        { month: "Feb", users: 72, restaurants: 195 },
                        { month: "Mar", users: 78, restaurants: 210 },
                        { month: "Apr", users: 85, restaurants: 235 },
                        { month: "May", users: 90, restaurants: 256 },
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
                      <Area type="monotone" dataKey="users" stroke="#e6007e" fill="url(#colorUsers)" strokeWidth={2} />
                      <Area
                        type="monotone"
                        dataKey="restaurants"
                        stroke="#8884d8"
                        fill="url(#colorRestaurants)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e6007e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#e6007e" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorRestaurants" x1="0" y1="0" x2="0" y2="1">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatedGradientBorder>
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">User Distribution</CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AnimatedGradientBorder>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Your latest administrative actions</CardDescription>
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
