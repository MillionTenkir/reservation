"use client"

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AgentsPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
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
        <h1 className="text-3xl font-bold tracking-tight">Field Agents</h1>
        <p className="text-gray-500">Manage all field agents in the system</p>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Field Agents</CardTitle>
            <CardDescription>A list of all field agents in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-[#fce7f3] flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-[#e6007e]" />
                  </div>
                  <div>
                    <p className="font-medium">Agent {i}</p>
                    <p className="text-sm text-gray-500">Branch {Math.ceil(i / 2)}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant={i % 2 === 0 ? "default" : "outline"} className="bg-[#e6007e]">
                      {i % 2 === 0 ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-gray-500">{i * 10} restaurants</span>
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
