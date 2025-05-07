"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import OtpVerification from "@/components/otp-verification";
import { motion } from "framer-motion";
import Logo from "@/components/logo";
import Image from "next/image";
// Remove this import
// import Footer from "@/components/footer"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      // Ensure the phone number has the +251 prefix when sending to API
      const formattedPhone = phone.startsWith("+251") ? phone : `+251${phone}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sendOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: formattedPhone }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send verification code"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      setShowOtp(true);
    },
    onError: (error: Error) => {
      // console.log("The error is: ", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Ethiopian phone number",
        variant: "destructive",
      });
      return;
    }

    sendOtpMutation.mutate(phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  // And in the return statement, replace the entire component with:
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          {!showOtp ? (
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-8">
                <div className="flex justify-center mb-6">
                  <Logo className="w-32 h-auto" />
                </div>
                <CardTitle className="text-2xl text-center font-gray-800">
                  Welcome to CHECHE
                </CardTitle>
                <CardDescription className="text-center text-base font-gray-800">
                  Sign in to your account to make a reservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-gray-800">
                      Phone Number
                    </Label>
                    <div className="flex relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <div className="flex items-center space-x-1">
                          {/* <Image
                            src="/images/ethiopia-flag.svg"
                            alt="Ethiopia"
                            width={24}
                            height={16}
                            className="rounded-sm"
                          /> */}
                          <span className="text-gray-500 text-lg">+251</span>
                        </div>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9xxxxxxxx"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="h-12 text-lg font-gray-800 pl-24"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-[#E6007E] hover:bg-[#C4006C] font-gray-800"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <OtpVerification
              phoneNumber={`+251${phoneNumber}`}
              onBack={() => setShowOtp(false)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
