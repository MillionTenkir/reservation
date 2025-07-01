"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FullPageSpinner } from "@/components/ui/spinner"

type Role =
  | "cb57b04b-3418-42b9-83e9-d770aa54875a"
  | "b7dffb6d-8c49-4705-ae2b-ebd70555cac7"
  | "01bf91c3-abb9-4c5c-8b84-364dd28e8688"
  | "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc"
  | "ff59819f-102b-4fb9-9399-e3e44ed7386e"
  | "4f0b86ba-9c17-4543-8542-1041da444fa3";

export function useRoleGuard(allowedRoles: Role[]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      if (!allowedRoles.includes(user.role as Role)) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router, allowedRoles])

  return { isAuthorized: user && allowedRoles.includes(user.role as Role), isLoading }
}

// Create a component to use with the role guard
export function RoleGuardLoading() {
  return <FullPageSpinner />
}
