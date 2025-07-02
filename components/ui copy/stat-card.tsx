"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import CountUp from "react-countup";

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  className?: string;
  decimal?: boolean;
  prefix?: string;
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  change,
  className,
  decimal = false,
  prefix,
}: StatCardProps) {
  const trendColor = change
    ? change.trend === "up"
      ? "text-green-500"
      : change.trend === "down"
      ? "text-red-500"
      : "text-gray-500"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={cn("h-full")}
    >
      <Card
        className={`h-full overflow-hidden border border-border/50 shadow-sm transition-all hover:shadow-md ${className}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-muted-foreground text-white">
                {title}
              </h1>
              <div className="mt-1 flex items-baseline">
                <h3 className="text-2xl font-bold tracking-tight">
                  {prefix}
                  <CountUp
                    end={value}
                    duration={2}
                    separator=","
                    decimal="."
                    decimals={decimal ? 2 : 0}
                  />
                  {unit && (
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      {unit}
                    </span>
                  )}
                </h3>
              </div>
              {change && (
                <p className={cn("mt-1 flex items-center text-xs", trendColor)}>
                  {change.trend === "up" ? (
                    <span className="mr-1">↑</span>
                  ) : change.trend === "down" ? (
                    <span className="mr-1">↓</span>
                  ) : (
                    <span className="mr-1">→</span>
                  )}
                  {change.value}%
                </p>
              )}
            </div>
            <div className="rounded-full bg-[#fce7f3] p-3">
              <Icon className="h-5 w-5 text-pink-900" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
