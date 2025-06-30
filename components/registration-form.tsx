"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Logo from "@/components/logo"

interface RegistrationFormProps {
  phoneNumber: string
  otp: string
}

export default function RegistrationForm({ phoneNumber, otp }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Replace with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          mobile: phoneNumber, 
          otp,
          role: "Customer User Access"
        }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Set auth token in cookie
      document.cookie = `auth-token=${data.token}; path=/; max-age=86400`
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        className: "bg-green-50 border-green-200 text-green-800",
      })
      router.push("/")
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!formData.firstname || !formData.lastname || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    registerMutation.mutate(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-6">
            <Logo className="w-32 h-auto" />
          </div>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center text-base">
            Please provide your information to complete registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="firstname" className="text-base">
                  First Name
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  placeholder="Enter your first name"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastname" className="text-base">
                  Last Name
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Enter your last name"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base mt-4 bg-[#E6007E] hover:bg-[#C4006C]"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
