"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";

export default function LoginPage() {
  const [mobile, setMobile] = useState("+251");
  const [password, setPassword] = useState("");
  const { adminLogin, isAdminLoading, adminError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLogin(mobile, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary pattern-dots">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-4"
      >
        <AnimatedGradientBorder>
          <Card className="border-0 shadow-none backdrop-blur-sm bg-background/80">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-40 h-12 relative mb-4 animate-float"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-11%20100453-T09zXs1H3Duze33mr84jwrRWuoFOtL.png"
                  alt="CHECHE Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription>
                Enter your mobile number and password to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {adminError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{adminError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-[#e6007e]"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {/* <Button variant="link" className="px-0 text-xs" type="button">
                      Forgot password?
                    </Button> */}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-[#e6007e]"
                  />
                </motion.div>
              </form>
            </CardContent>
            <CardFooter>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="w-full"
              >
                <Button
                  className="w-full bg-[#e6007e] hover:opacity-90 transition-opacity"
                  onClick={handleSubmit}
                  disabled={isAdminLoading}
                >
                  {isAdminLoading ? (
                    <>
                      <Spinner className="mr-2" size="sm" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </AnimatedGradientBorder>
      </motion.div>
    </div>
  );
}
