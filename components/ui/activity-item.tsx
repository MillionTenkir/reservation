"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  timestamp: string
  className?: string
}

export function ActivityItem({ icon: Icon, title, description, timestamp, className }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0", className)}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce7f3]"
      >
        <Icon className="h-5 w-5 text-[#e6007e]" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <div className="text-sm text-muted-foreground whitespace-nowrap">{timestamp}</div>
    </motion.div>
  )
}
