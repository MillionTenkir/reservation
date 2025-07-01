"use client"

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function RestaurantsPage() {
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

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <p className="text-gray-500">Manage all restaurants in the system</p>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurants</CardTitle>
            <CardDescription>A list of all restaurants in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-[#fce7f3] flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-[#e6007e]" />
                  </div>
                  <div>
                    <p className="font-medium">Restaurant {i}</p>
                    <p className="text-sm text-gray-500">
                      Branch {Math.ceil(i / 3)} • Agent {Math.ceil(i / 2)}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant={i % 3 === 0 ? "default" : "outline"} className={i % 3 === 0 ? "bg-[#e6007e]" : ""}>
                      {i % 3 === 0 ? "Premium" : "Standard"}
                    </Badge>
                    <span className="text-sm text-gray-500">{i * 8} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
