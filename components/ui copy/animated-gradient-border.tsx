"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedGradientBorderProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
  animate?: boolean
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  animate = true,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative rounded-lg p-[1px] overflow-hidden", containerClassName)}>
      {animate ? (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-r from-[#e6007e] via-[#ff6ec4] to-[#e6007e] opacity-70",
            gradientClassName,
          )}
          style={{ backgroundSize: "200% 200%" }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-r from-[#e6007e] via-[#ff6ec4] to-[#e6007e] opacity-70",
            gradientClassName,
          )}
        />
      )}
      <div className={cn("relative rounded-[7px] bg-card p-4", className)}>{children}</div>
    </div>
  )
}
