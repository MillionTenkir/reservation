"use client"

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ])

  if (isLoading) {
    return <RoleGuardLoading />
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-gray-500">View and generate reports</p>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="sales">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurant Reports</TabsTrigger>
            <TabsTrigger value="agents">Agent Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales data for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-[#fce7f3] rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#e6007e] mx-auto mb-4" />
                    <p className="text-lg font-medium">Sales Chart Placeholder</p>
                    <p className="text-sm text-gray-500">Monthly sales data would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Total Sales", value: "$24,500" },
                    { label: "Average Order", value: "$42.75" },
                    { label: "Orders", value: "573" },
                    { label: "Growth", value: "+12.5%" },
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Performance</CardTitle>
                <CardDescription>Performance metrics for restaurants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-[#fce7f3] rounded-md">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-[#e6007e] mx-auto mb-4" />
                    <p className="text-lg font-medium">Restaurant Chart Placeholder</p>
                    <p className="text-sm text-gray-500">Restaurant performance data would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Total Restaurants", value: "256" },
                    { label: "Active Restaurants", value: "218" },
                    { label: "Top Performer", value: "Restaurant 12" },
                    { label: "Avg. Rating", value: "4.7/5" },
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Performance metrics for field agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-[#fce7f3] rounded-md">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-[#e6007e] mx-auto mb-4" />
                    <p className="text-lg font-medium">Agent Chart Placeholder</p>
                    <p className="text-sm text-gray-500">Agent performance data would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Total Agents", value: "48" },
                    { label: "Active Agents", value: "42" },
                    { label: "Top Performer", value: "Agent 7" },
                    { label: "Avg. Restaurants", value: "12" },
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
