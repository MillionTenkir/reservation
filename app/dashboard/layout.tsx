"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FullPageSpinner } from "@/components/ui/spinner"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { adminUser, isAdminLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdminLoading && !adminUser) {
      router.push("/admin")
    }
  }, [adminUser, isAdminLoading, router])

  if (isAdminLoading) {
    return <FullPageSpinner />
  }

  if (!adminUser) {
    return <FullPageSpinner />
  }

  return (
    <div className="flex h-screen pattern-dots">
      <DashboardSidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto bg-background/80 backdrop-blur-sm"
      >
        {children}
      </motion.main>
    </div>
  )
}
