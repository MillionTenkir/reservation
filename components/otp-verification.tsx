"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import RegistrationForm from "./registration-form";
import Logo from "@/components/logo";
import { useAuth } from "@/lib/auth-context";

interface OtpVerificationProps {
  phoneNumber: string;
  onBack: () => void;
}

export default function OtpVerification({
  phoneNumber,
  onBack,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isNewUser, setIsNewUser] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { setToken } = useAuth();

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);
  }, []);

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/verifyOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: phoneNumber, otp: otpCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Check if status is 401 to show registration form
        if (response.status === 401) {
          throw new Error("REGISTRATION_REQUIRED");
        }
        throw new Error(errorData.message || "Failed to verify OTP");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
        // console.log("data", data);
        setToken(data);
        toast({
          title: "Success",
          description: "You have successfully logged in",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: "Authentication failed. No token received.",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    },
    onError: (error: Error) => {
      if (error.message === "REGISTRATION_REQUIRED") {
        setIsNewUser(true);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, 5).split("");

    if (pastedOtp.length > 0 && pastedOtp.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 5) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 5) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[4]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 5) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 5-digit OTP",
        variant: "destructive",
      });
      return;
    }

    verifyOtpMutation.mutate(otpCode);
  };

  if (isNewUser) {
    return <RegistrationForm phoneNumber={phoneNumber} otp={otp.join("")} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex justify-center mb-6">
            <Logo className="w-32 h-auto" />
          </div>
          <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center text-base">
            Enter the 5-digit code sent to {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex justify-center gap-1 sm:gap-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl"
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base bg-[#E6007E] hover:bg-[#C4006C] mt-4"
                disabled={verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onBack} className="text-base">
            Back
          </Button>
          <Button variant="link" className="text-[#E6007E] text-base">
            Resend OTP
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
