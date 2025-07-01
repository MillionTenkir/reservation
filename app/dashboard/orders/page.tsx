"use client"

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function OrdersPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
    "ff59819f-102b-4fb9-9399-e3e44ed7386e",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  if (isLoading) {
    return <RoleGuardLoading />
  }

  if (!isAuthorized) {
    return null
  }

  const getStatusBadge = (index: number) => {
    const statuses = [
      { label: "Completed", variant: "default", color: "bg-green-500" },
      { label: "Processing", variant: "default", color: "bg-[#e6007e]" },
      { label: "Pending", variant: "outline", color: "" },
      { label: "Cancelled", variant: "outline", color: "border-red-500 text-red-500" },
    ]

    return statuses[index % 4]
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-gray-500">Manage all orders in the system</p>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>A list of recent orders in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                const status = getStatusBadge(i)

                return (
                  <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-[#fce7f3] flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-[#e6007e]" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{1000 + i}</p>
                      <p className="text-sm text-gray-500">
                        Restaurant {Math.ceil(i / 2)} • {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant={status.variant as "default" | "outline"} className={status.color}>
                        {status.label}
                      </Badge>
                      <span className="text-sm font-medium">${(i * 12.5).toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
