"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface FuturisticModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FuturisticModal({ open, onOpenChange, title, description, children, className }: FuturisticModalProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (!open) {
      setAnimationComplete(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className={cn("border-none bg-transparent shadow-none p-0 max-w-3xl overflow-hidden", className)}
            onInteractOutside={(e) => {
              if (animationComplete) {
                e.preventDefault()
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-0"
              onClick={() => onOpenChange(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                onComplete: () => setAnimationComplete(true),
              }}
              className="relative z-10 bg-white backdrop-blur-md rounded-xl border border-border/50 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#e6007e]/10 via-[#ff6ec4]/5 to-[#e6007e]/10 opacity-70 pointer-events-none" />

              {/* <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#e6007e] via-[#ff6ec4] to-[#e6007e]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "linear",
                  }}
                />
              </div> */}

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>

              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                  {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="relative z-10">{children}</div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
